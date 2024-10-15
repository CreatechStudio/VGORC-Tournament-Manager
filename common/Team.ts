import {Data} from "./Data";
import {Utils} from "../backend/src/Database/Utils";

export interface TeamObject {
    teamNumber: string,
    teamName: string,
    teamOrganization: string,
    teamDivision: string,
    teamAvgScore: number
}

export class Team {
    data: {[key: string]: TeamObject | undefined} = {};
    db: Utils = new Utils();

    constructor() {
        this.db.getData().teams.forEach(t => {
            this.data[t.teamNumber] = t;
        });
    }

    add(aTeam: TeamObject) {
        if (this.data[aTeam.teamNumber] !== undefined) {
            throw "Division already exist";
        }
        if (aTeam.teamNumber.length === 0) {
            throw "Division name should not be empty";
        }
        this.data[aTeam.teamNumber] = aTeam;
        this._update();
    }

    get() {
        return this.db.getData().teams;
    }

    delete(teamNumber: string) {
        if (this.data[teamNumber] === undefined) {
            throw "Division does not exist";
        }
        this.data[teamNumber] = undefined;
        this._update();
    }

    _update() {
        const teams: TeamObject[] = [];
        Object.values(this.data).forEach((d) => {
            if (d !== undefined) {
                teams.push(d);
            }
        });
        let newData: Data = this.db.getData();
        newData.teams = teams;
        this.db.updateData(newData);
    }
}
