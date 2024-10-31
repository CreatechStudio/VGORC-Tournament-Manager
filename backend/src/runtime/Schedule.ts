import {Utils} from "../Utils";
import {MatchObject, MatchWithDivision} from "../../../common/Match";
import {TeamObject} from "../../../common/Team";
import {Data} from "../../../common/Data";

export class Schedule {
    dataTeam: TeamObject[] = [];
    dataMatchWithDivision: MatchWithDivision[] = []
    db: Utils = new Utils();

    _getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    _indexOf(divisionName: string) {
        this.dataMatchWithDivision = this.db.getData().matches;
        for (let i = 0; i < this.dataMatchWithDivision.length; i++) {
            if (this.dataMatchWithDivision[i].divisionName === divisionName) {
                return i;
            }
        }
    }

    _getAllDivision() {
        let allDivisions: string[] = [];
        this.dataMatchWithDivision = this.db.getData().matches;
        this.dataMatchWithDivision.forEach(matchWithDivision => {
            allDivisions.push(matchWithDivision.divisionName);
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
        let allFieldSets: string[] = [];
        this.db.getData().settings.fieldSets.forEach(fieldSet => {
            allFieldSets = allFieldSets.concat(fieldSet.fields);
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

        const availableTime = (periodEndTime.getTime() - periodStartTime.getTime()) / (1000 * 60); // Convert to minutes
        return Math.floor(availableTime / periodMatchDuration);
    }

    _pairTeammatesInDivision(divisionName: string) {
        let allTeams = this._getAllTeamsInDivision(divisionName);
        let indexTeamOne: number = 0;
        let indexTeamTwo: number = 0;
        while (!(indexTeamOne = indexTeamTwo)) {
            indexTeamOne =  this._getRandomInt(allTeams.length);
            indexTeamTwo = this._getRandomInt(allTeams.length);
        }
        return [allTeams[indexTeamOne], allTeams[indexTeamTwo]];
    }

    get() {
        return this.db.getData().matches;
    }

    add() {
        const divisionName = this._getAllDivision()
        const periodNumber = this._getAllPeriods()
        divisionName.forEach(division => {
            periodNumber.forEach(period => {
                this.dataMatchWithDivision = this.db.getData().matches;
                let divisionIndex = this._indexOf(division);

                if (divisionIndex === undefined) {
                    this.dataMatchWithDivision.push({
                        divisionName: division,
                        matches: []
                    });
                    divisionIndex = this.dataMatchWithDivision.length - 1;
                }

                const matchCount = this._calcMatchCountInPeriod(period);
                const fields = this._getAllFieldsInDivision(division);
                let matchNumber = this.dataMatchWithDivision[divisionIndex].matches.length + 1;

                for (let i = 0; i < matchCount; i++) {
                    const matchTeams = this._pairTeammatesInDivision(division);
                    const matchField = fields[i % fields.length];
                    const fieldSet = +this._getAllFieldsSets()[i % this._getAllFieldsSets().length];

                    const newMatch: MatchObject = {
                        matchNumber: matchNumber++,
                        matchType: "Qualification",
                        matchField: matchField,
                        matchFieldSet: fieldSet,
                        matchPeriod: period,
                        matchCountInPeriod: i + 1,
                        matchTeam: matchTeams,
                        hasScore: false,
                        matchScore: 0
                    };

                    this.dataMatchWithDivision[divisionIndex].matches.push(newMatch);
                }
            })
        })

        this._update();
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.matches = this.dataMatchWithDivision;
        this.db.updateData(newData);
    }

}
