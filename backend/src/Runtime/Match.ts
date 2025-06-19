import {Utils} from "../Utils";
import {Data} from "../../../common/Data";
import {MatchObject, MatchWithDivision} from "../../../common/Match";
import {Admin} from "./Admin";
import {Schedule} from "./Schedule";

export class Match {
    data: MatchWithDivision[] = [];
    db: Utils = new Utils();

    _locateMatch(divisionName: string, matchNumber: number): MatchObject {
        let data = this.db.getData();
        let decodedDivisionName = decodeURIComponent(divisionName);
        let foundMatch: MatchObject | null = null;
        data.matches.forEach(division => {
            if (division.divisionName === decodedDivisionName) {
                division.matches.forEach(match => {
                    if (match.matchNumber === matchNumber) {
                        foundMatch = match;
                    }
                });
            }
        });
        if (!foundMatch) {
            throw `Match with number ${matchNumber} not found in division ${decodedDivisionName}`;
        }
        return foundMatch;
    }

    _handleEliminationDraw(divisionName: string, matchType: string) {
        let data = this.db.getData();
        const decodedDivisionName = decodeURIComponent(divisionName);
        let division: MatchWithDivision | undefined = data.matches.find(div => div.divisionName === decodedDivisionName);
        if (division) {
            // 检查所有淘汰赛是否都有分数
            if (division.matches.every(match => match.hasScore)) {
                let eliminationMatches = division.matches.filter(match => match.matchType === matchType && match.hasScore);
                // 按分数分组
                const scoreMap = new Map<number, MatchObject[]>();
                eliminationMatches.forEach(match => {
                    if (!scoreMap.has(match.matchScore)) {
                        scoreMap.set(match.matchScore, []);
                    }
                    scoreMap.get(match.matchScore)!.push(match);
                });
                const sameScoreMatches = Array.from(scoreMap.values()).filter(group => group.length > 1);
                let newmatchNumber = division.matches[division.matches.length - 1].matchNumber + 1;
                let ScheduleTools = new Schedule();
                let fields = ScheduleTools._getAllFieldsInDivision(divisionName);
                // 如果有分数相同的淘汰赛，创建新的淘汰赛
                sameScoreMatches.forEach(sameScoreMatch => {
                    sameScoreMatch.forEach((match) => {
                        let newMatch: MatchObject = {
                            matchNumber: newmatchNumber++,
                            matchType: match.matchType,
                            matchField: match.matchField,
                            matchFieldSet: 0,
                            matchPeriod: 0,
                            matchCountInPeriod: 0,
                            matchStartTime: "",
                            matchTeam: match.matchTeam,
                            hasScore: false,
                            matchScore: 0,
                            matchScoreHistory: [],
                            scoreDetails: {}
                        };

                        data.matches[divisionName.indexOf(divisionName)].matches.push(newMatch);
                    })
                })
                this.db.updateData(data);
            }
        }
    }

    setScore(
        divisionName: string,
        matchNumber: number,
        scoreDetails: Record<string, number>
    ) {
        const decodedDivisionName = decodeURIComponent(divisionName);
        const currentMatch = this._locateMatch(decodedDivisionName, matchNumber);
        const admin = new Admin()
        const matchGoals = admin.get().matchGoals;
        let totalScore = 0;

        for (const [key, count] of Object.entries(scoreDetails)) {
            const goal = matchGoals[key];
            if (!goal) {
                throw `Invalid matchGoal key: ${key}`;
            }
            totalScore += goal.points * count;
        }

        currentMatch.matchScore = totalScore;
        currentMatch.matchScoreHistory.push(totalScore);
        currentMatch.hasScore = true;
        currentMatch.scoreDetails = scoreDetails;

        this.data.forEach(division => {
            if (division.divisionName === decodedDivisionName) {
                division.matches.forEach((match, matchIndex) => {
                    if (match.matchNumber === matchNumber) {
                        division.matches[matchIndex] = currentMatch;
                    }
                });
            }
        });

        this._update(divisionName, currentMatch);

        if (currentMatch.matchType !== "Qualification") {
            this._handleEliminationDraw(decodedDivisionName, currentMatch.matchType);
        }

        return currentMatch;
    }

    getAllMatches(divisionName: string) {
        let decodedDivisionName = decodeURIComponent(divisionName);
        let data = this.db.getData();
        let foundMatches: MatchObject[] = [];
        data.matches.forEach(division => {
            if (division.divisionName === decodedDivisionName) {
                foundMatches = division.matches;
            }
        });
        return foundMatches
    }

    getMatch(divisionName: string, matchNumber: number) {
        return this._locateMatch(divisionName, matchNumber);
    }

    _update(divisionName: string, currentMatch: MatchObject) {
        let newData: Data = this.db.getData();
        let decodedDivisionName = decodeURIComponent(divisionName);

        newData.matches.forEach(division => {
            if (division.divisionName === decodedDivisionName) {
                division.matches.forEach((match, matchIndex) => {
                    if (match.matchNumber === currentMatch.matchNumber) {
                        division.matches[matchIndex] = currentMatch;
                    }
                });
            }
        });

        this.db.updateData(newData);
    }
}
