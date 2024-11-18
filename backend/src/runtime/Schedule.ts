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
            throw "Match schedule is not empty";
        }
        const divisionName = this._getAllMatchDivision()
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
                let teams = this._pairTeammatesInDivision(division);
                let fields = this._getAllFieldsInDivision(division);
                for (let i = 0; i < teams.length; i++) {
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
        const divisionName = this._getAllMatchDivision();
        this.dataMatchWithDivision = this.db.getData().matches;
        let allMatches: MatchObject[][] = Array.from({ length: divisionName.length }, () => []);
        divisionName.forEach(division => {
            if (!this._ensureAllQualificationIsScored(division)) {
                throw new Error("Not all qualification matches are scored");
            }
            let allQMatches = this.dataMatchWithDivision[divisionName.indexOf(division)].matches.filter(match => match.matchType === "Qualification");
            let matchNumber = allQMatches[allQMatches.length-1].matchNumber + 1;
            let teams = this._getLeadingTeamInDivision(division, this.db.getData().settings.adminData.eliminationAllianceCount * 2);
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
