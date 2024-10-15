export interface TeamObject {
    teamNumber: string,
    teamName: string,
    teamOrganization: string,
    teamDivision: string,
    teamAvgScore: number
}

export class Team {
    data: {[key: string]: TeamObject | undefined} = {};

    constructor() {}

    add(aTeam: TeamObject) {
        if (this.data[aTeam.teamNumber] !== undefined) {
            throw "Division already exist";
        }
        if (aTeam.teamNumber.length === 0) {
            throw "Division name should not be empty";
        }
        this.data[aTeam.teamNumber] = aTeam;
    }

    get() {
        return this.data;
    }

    delete(teamNumber: string) {
        if (this.data[teamNumber] === undefined) {
            throw "Division does not exist";
        }
        this.data[teamNumber] = undefined;
    }

}