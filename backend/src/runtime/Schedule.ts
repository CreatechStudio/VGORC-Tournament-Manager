import {Utils} from "../Utils";
import {MatchObject, MatchWithDivision} from "../../../common/Match";
import {TeamObject} from "../../../common/Team";
import {Data} from "../../../common/Data";

export class Schedule {
    dataTeam: TeamObject[] = [];
    dataMatchWithDivision: MatchWithDivision[] = []
    db: Utils = new Utils();

    _getAllDivision() {
        let allDivisions: string[] = [];
        let divisions = this.db.getData().settings.division
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
        let allFieldSets: number[] = [];
        this.db.getData().settings.fieldSets.forEach(fieldSet => {
            allFieldSets = allFieldSets.concat(fieldSet.fieldSetId);
        });
        return allFieldSets
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

    _calcMatchCountInDivision(divisionName: string): number {
        let allPeriods = this._getAllPeriods();
        let matchCount = 0;
        allPeriods.forEach(period => {
            matchCount += this._calcMatchCountInPeriod(period);
        })
        return matchCount;
    }

    _pairTeammatesInDivision(divisionName: string): string[][] {
        let allTeams = this._getAllTeamsInDivision(divisionName);
        let matchCountInDivision = this._calcMatchCountInDivision(divisionName);

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
            teams[i].push(allTeams[teamIndex]);
            teamIndex = (teamIndex + 1) % allTeams.length;
            teams[i].push(allTeams[teamIndex]);
            teamIndex = (teamIndex + 1) % allTeams.length;
        }

        return teams;
    }

    get() {
        return this.db.getData().matches;
    }

    add() {
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

        // Iterate over each division and period to add matches
        divisionName.forEach((division, divisionIndex) => {
            let matchNumber = 1;
            periodNumber.forEach(period => {
                let matchCountInPeriod = this._calcMatchCountInPeriod(period);
                let teams = this._pairTeammatesInDivision(division);
                let fields = this._getAllFieldsInDivision(division);
                for (let i = 0; i < matchCountInPeriod; i++) {
                    let match: MatchObject = {
                        matchNumber: matchNumber++,
                        matchType: "Qualification",
                        matchField: fields[i % fields.length],
                        matchFieldSet: fieldSets[i % fieldSets.length],
                        matchPeriod: period,
                        matchCountInPeriod: i + 1,
                        matchTeam: teams[i],
                        hasScore: false,
                        matchScore: 0
                    };
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

    _update() {
        let newData: Data = this.db.getData();
        newData.matches = this.dataMatchWithDivision;
        this.db.updateData(newData);
    }

}
