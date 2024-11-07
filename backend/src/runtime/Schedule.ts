import {Utils} from "../Utils";
import {MatchObject, MatchWithDivision} from "../../../common/Match";
import {TeamObject} from "../../../common/Team";
import {Data} from "../../../common/Data";
import {Ranking} from "./Ranking";

export class Schedule {
    dataTeam: TeamObject[] = [];
    dataMatchWithDivision: MatchWithDivision[] = []
    db: Utils = new Utils();

    _getAllDivision() {
        let allDivisions: string[] = [];
        let divisions = this.db.getData().settings.division
        divisions.filter(division => !division.isSkill);
        divisions.forEach(division => {
            allDivisions.push(division.divisionName);
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
            throw new Error(`Period ${periodNumber} not found`);
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

    _pairTeammatesInDivision(divisionName: string): string[][] {
        let allTeams = this._getAllTeamsInDivision(divisionName);
        let matchCountInDivision = this._calcMatchCountInDivision();

        // Shuffle the teams
        for (let i = allTeams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allTeams[i], allTeams[j]] = [allTeams[j], allTeams[i]];
        }

        // Create an array to hold the matches
        let teams: string[][] = Array.from({ length: matchCountInDivision }, () => []);

        // Distribute teams into matches ensuring each match has two different teams
        let teamIndex = 0;
        for (let i = 0; i < matchCountInDivision; i++) {
            teams[i] = [allTeams[teamIndex], allTeams[(teamIndex + 1) % allTeams.length]];
            teamIndex = (teamIndex + 2) % allTeams.length;
        }

        // Shuffle the teams
        teams.forEach(match => {
            const j = Math.floor(Math.random() * teams.length);
            [match[1], teams[j][1]] = [teams[j][1], match[1]];
        });

        // Ensure no duplicate teams in the same match
        for (let i = 0; i < teams.length; i++) {
            if (teams[i][0] === teams[i][1]) {
                for (let j = 0; j < teams.length; j++) {
                    if (teams[j][0] !== teams[i][0] && teams[j][1] !== teams[i][0]) {
                        [teams[i][1], teams[j][1]] = [teams[j][1], teams[i][1]];
                        break;
                    }
                }
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

    _ensureMatchScheduleIsEmpty() {
        let allMatches = this.db.getData().matches;
        if (allMatches.length === 0) {
            return true;
        }
        allMatches.forEach(matches => {
            if (matches.matches.length > 0) {
                return false;
            }
        });
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
        if (!this._ensureMatchScheduleIsEmpty()) {
            throw new Error("Match schedule is not empty");
        }
        const divisionName = this._getAllDivision();
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

        const matchCountInPeriodWithField: {[Key: string]: number} = {};

        fieldSets.forEach((set, index) => {
            set.fields.forEach((field) => {
                matchCountInPeriodWithField[field] = index + 1;
            });
        });

        // Iterate over each division and period to add matches
        divisionName.forEach((division, divisionIndex) => {
            let matchNumber = 1;
            periodNumber.forEach(period => {
                let totalMatchCountInPeriod = this._calcMatchCountInPeriod(period);
                let teams = this._pairTeammatesInDivision(division);
                let fields = this._getAllFieldsInDivision(division);
                for (let i = 0; i < totalMatchCountInPeriod; i++) {
                    let match: MatchObject = {
                        matchNumber: matchNumber++,
                        matchType: "Qualification",
                        matchField: fields[i % fields.length],
                        matchFieldSet: fieldSets[i % fieldSets.length].fieldSetId,
                        matchPeriod: period,
                        matchCountInPeriod: 0,
                        matchTeam: teams[i],
                        hasScore: false,
                        matchScore: 0
                    };

                    match.matchCountInPeriod = matchCountInPeriodWithField[match.matchField];
                    matchCountInPeriodWithField[match.matchField] += fieldSets.length;

                    allMatches[divisionIndex].push(match);
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
        const divisionName = this._getAllDivision();
        this.dataMatchWithDivision = this.db.getData().matches;
        let allMatches: MatchObject[][] = Array.from({ length: divisionName.length }, () => []);
        divisionName.forEach(division => {
            if (!this._ensureAllQualificationIsScored(division)) {
                throw new Error("Not all qualification matches are scored");
            }
            let matchNumber = 1;
            let teams = this._getLeadingTeamInDivision(division, this.db.getData().settings.eliminationAllianceCount * 2);
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
                    matchScore: 0
                };
                allMatches[divisionName.indexOf(division)].push(match);
            }
        })
        this.dataMatchWithDivision.forEach((matches, index) => {
            matches.matches = matches.matches.concat(allMatches[index]);
        })
        this._update();
    }

    clearAllSchedule() {
        let newData: Data = this.db.getData();
        newData.matches = [];
        this.db.updateData(newData);
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.matches = this.dataMatchWithDivision;
        this.db.updateData(newData);
    }
}
