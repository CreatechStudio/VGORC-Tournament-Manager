import {Utils} from "../Utils";
import {MatchObject, MatchWithDivision} from "../../../common/Match";
import {TeamObject} from "../../../common/Team";
import {Data} from "../../../common/Data";
import {Ranking} from "./Ranking";

export class Schedule {
    dataTeam: TeamObject[] = [];
    dataMatchWithDivision: MatchWithDivision[] = []
    db: Utils = new Utils();

    _getAllMatchDivision() {
        let allDivisions: string[] = [];
        let divisions = this.db.getData().settings.division
        divisions.forEach(division => {
            if (!division.isSkill) {
                allDivisions.push(division.divisionName);
            }
        })

        return allDivisions
    }

    _getAllTeamsInDivision(divisionName: string) {
        let allTeams: string[] = [];
        this.dataTeam = this.db.getData().teams;
        this.dataTeam.forEach(team => {
            if (team.teamDivision === divisionName) {
                allTeams.push(team.teamNumber);
            }
        })
        return allTeams
    }

    _getAllFieldsInDivision(divisionName: string) {
        let allFields: string[] = [];
        this.db.getData().settings.division.forEach(division => {
            if (division.divisionName === divisionName) {
                allFields = division.divisionFields;
            }
        })
        return allFields
    }

    _getAllFieldsSets() {
        return this.db.getData().settings.fieldSets;
    }

    _getAllPeriods() {
        let allPeriods: number[] = [];
        this.db.getData().periods.forEach(period => {
            allPeriods.push(period.periodNumber);
        })
        return allPeriods
    }

    _calcMatchCountInPeriod(periodNumber: number): number {
        const periods = this.db.getData().periods;
        const period = periods.find(p => p.periodNumber === periodNumber);
        if (!period) {
            throw `Period ${periodNumber} not found`;
        }
        const periodStartTime = new Date(period.periodStartTime);
        const periodEndTime = new Date(period.periodEndTime);
        const periodMatchDuration = period.periodMatchDuration;

        const availableTime = (periodEndTime.getTime() - periodStartTime.getTime()) / (1000 * 60);
        return Math.floor(availableTime / periodMatchDuration);
    }

    _calcMatchCountInDivision(): number {
        let allPeriods = this._getAllPeriods();
        let matchCount = 0;
        allPeriods.forEach(period => {
            matchCount += this._calcMatchCountInPeriod(period);
        })
        return matchCount;
    }

    _shuffleTeams(divisionName: string) {
        let allTeams = this._getAllTeamsInDivision(divisionName);
        for (let i = allTeams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allTeams[i], allTeams[j]] = [allTeams[j], allTeams[i]];
        }
        return allTeams;
    }

    _pairTeammatesInDivision(divisionName: string): string[][] {
        let allTeams = this._getAllTeamsInDivision(divisionName);
        let matchCountInDivision = this._calcMatchCountInDivision();
        let isTeamCountOdd = allTeams.length % 2 !== 0;

        // Create an array to hold the matches
        let teams: string[][] = [];
        let count: {[Keys: string]: number} = {};

        while (teams.length < matchCountInDivision) {
            allTeams = this._shuffleTeams(divisionName);
            if (isTeamCountOdd) {
                allTeams.push(...allTeams);
            }
            for (let i = 0; i < allTeams.length - 1; i+=2) {
                if (count[allTeams[i]]) {
                    count[allTeams[i]] += 1;
                } else {
                    count[allTeams[i]] = 1;
                }
                if (count[allTeams[i+1]]) {
                    count[allTeams[i+1]] += 1;
                } else {
                    count[allTeams[i+1]] = 1;
                }
                teams.push([allTeams[i], allTeams[i + 1]]);
            }
        }

        while (1) {
            const values = Object.values(count);
            const c = new Set(values);
            if (teams.length <= matchCountInDivision) {
                if (c.size === 1) {
                    break;
                }
                if (isTeamCountOdd) {
                    const data: {[Keys: number]: number} = {};
                    values.forEach(v => {
                        if (data[v]) {
                            data[v] += 1;
                        } else {
                            data[v] = 1;
                        }
                    });
                    const largerOneKey = Math.max(...c);
                    if (data[largerOneKey] === 1 && c.size === 2) {
                        break;
                    }
                }
            }
            const last = teams.pop();
            if (last) {
                last.forEach(i => {
                    count[i] -= 1;
                });
            } else {
                break;
            }
        }

        return teams;
    }

    _getLeadingTeamInDivision(divisionName: string, first: number) {
        let rank = new Ranking()
        let rankingInDivision = rank.getQualRanking(divisionName);
        let leadingTeams: string[] = [];
        for (let i = 0; i < first; i++) {
            leadingTeams.push(rankingInDivision[i].teamNumber);
        }
        return leadingTeams;
    }

    _ensureScheduleIsEmpty(matchType: string) {
        let allMatches = this.db.getData().matches;
        if (allMatches.length === 0) {
            return true;
        }
        allMatches = allMatches.filter(matches => matches.matches.some(match => match.matchType === matchType));
        if (allMatches.length === 0) {
            return true;
        }
    }

    _isAnyMatchHasScore(matchType: string) {
        const matches = this.db.getData().matches;
        for (const division of matches) {
            for (const match of division.matches) {
                if (match.matchType === matchType && match.hasScore) {
                    return true;
                }
            }
        }
        return false;
    }

    _ensureAllQualificationIsScored(divisionName: string) {
        let allMatches = this.db.getData().matches;
        if (allMatches.length === 0) {
            return false;
        }
        let matchesInDivision: MatchObject[] = [];
        allMatches.forEach(matches => {
            if (matches.divisionName === divisionName) {
                matchesInDivision = matches.matches;
            }
        });
        matchesInDivision.forEach(match => {
            if (!match.hasScore) {
                return false
            }
        })
        return true;
    }

    get(divisionName?: string) {
        let allMatches = this.db.getData().matches;
        if (!divisionName) {
            return allMatches;
        }
        let decodedDivisionName = decodeURIComponent(divisionName);
        allMatches = allMatches.filter(matches => matches.divisionName === decodedDivisionName);
        return allMatches
    }

    addQualification() {
        if (!this._ensureScheduleIsEmpty("Qualification")) {
            throw "Match schedule is not empty";
        }
        const divisionName = this._getAllMatchDivision();
        const periodNumber = this._getAllPeriods();
        const fieldSets = this._getAllFieldsSets();
        this.dataMatchWithDivision = [];

        // Initialize dataMatchWithDivision with empty matches for each division
        divisionName.forEach(division => {
            let matchWithDivision: MatchWithDivision = {
                divisionName: division,
                matches: []
            };
            this.dataMatchWithDivision.push(matchWithDivision);
        });
        this._update();

        // Initialize allMatches as a multidimensional array
        let allMatches: MatchObject[][] = Array.from({ length: divisionName.length }, () => []);

        // Iterate over each division and period to add matches
        divisionName.forEach((division, divisionIndex) => {
            let matchNumber = 1;
            let teams = this._pairTeammatesInDivision(division);
            periodNumber.forEach((period, periodIndex) => {
                // 用于记录某场比赛这个场地，这个period中的第几场
                const matchCountInPeriodWithField: {[Key: string]: number} = {};
                fieldSets.forEach((set, index) => {
                    set.fields.forEach((field) => {
                        matchCountInPeriodWithField[field] = index + 1;
                    });
                });

                let fields = this._getAllFieldsInDivision(division);
                let index = 0;
                // 循环匹配好的每场比赛，并为他们匹配对应的场地
                while (true) {
                    const pair = teams.pop();
                    if (pair === undefined) {
                        break;
                    }

                    let match: MatchObject = {
                        matchNumber: matchNumber++,
                        matchType: "Qualification",
                        matchField: fields[index % fields.length],
                        matchFieldSet: fieldSets[index % fieldSets.length].fieldSetId,
                        matchPeriod: period,
                        matchCountInPeriod: 0,
                        matchTeam: pair,
                        hasScore: false,
                        matchScore: 0,
                        matchScoreHistory: []
                    };

                    index += 1;
                    match.matchCountInPeriod = matchCountInPeriodWithField[match.matchField];
                    matchCountInPeriodWithField[match.matchField] += fieldSets.length;

                    allMatches[divisionIndex].push(match);

                    // 如果下一场比赛超出了这个period预定的时间，那就直接杀掉，交给下一个period
                    // 当然，这不能是最后一个period
                    if (
                        matchCountInPeriodWithField[match.matchField] > this._calcMatchCountInPeriod(period)
                        && periodIndex + 1 < periodNumber.length
                    ) {
                        break;
                    }
                }
            });
        });

        // Push matches to dataMatchWithDivision
        allMatches.forEach((matches, index) => {
            this.dataMatchWithDivision[index].matches = matches;
        });

        this._update();
    }

    addElimination() {
        if (!this._ensureScheduleIsEmpty("Elimination")) {
            throw "Match schedule is not empty";
        }
        const divisionName = this._getAllMatchDivision();
        this.dataMatchWithDivision = this.db.getData().matches;
        let allMatches: MatchObject[][] = Array.from({ length: divisionName.length }, () => []);
        divisionName.forEach(division => {
            if (!this._ensureAllQualificationIsScored(division)) {
                throw new Error("Not all qualification matches are scored");
            }
            let allQMatches = this.dataMatchWithDivision[divisionName.indexOf(division)].matches.filter(match => match.matchType === "Qualification");
            let matchNumber = allQMatches[allQMatches.length-1].matchNumber + 1;
            let allTeams = this._getAllTeamsInDivision(division);
            let eliminationCount = this.db.getData().settings.adminData.eliminationAllianceCount;
            if (allTeams.length < eliminationCount) {
                eliminationCount = allTeams.length;
            }
            let teams = this._getLeadingTeamInDivision(division, eliminationCount);
            let fields = this._getAllFieldsInDivision(division);
            for (let i = 0; i < teams.length; i += 2) {
                let match: MatchObject = {
                    matchNumber: matchNumber++,
                    matchType: "Elimination",
                    matchField: fields[i % fields.length],
                    matchFieldSet: 0,
                    matchPeriod: 0,
                    matchCountInPeriod: 0,
                    matchTeam: [teams[teams.length - i - 1], teams[teams.length - (i + 1) - 1]],
                    hasScore: false,
                    matchScore: 0,
                    matchScoreHistory: []
                };
                allMatches[divisionName.indexOf(division)].push(match);
            }
        })
        this.dataMatchWithDivision.forEach((matches, index) => {
            matches.matches = matches.matches.concat(allMatches[index]);
        })

        this._update();
    }

    clearSchedule(matchType: string) {
        if (this._isAnyMatchHasScore(matchType)) {
            throw "Some matches have score";
        }
        let newData: Data = this.db.getData();
        newData.matches = newData.matches.map(division => {
            return {
                ...division,
                matches: division.matches.filter(match => match.matchType !== matchType)
            };
        });
        this.db.updateData(newData);
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.matches = this.dataMatchWithDivision;
        this.db.updateData(newData);
    }
}
