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
        if (aTeam.teamNumber.length === 0) {
            throw "Team number should not be empty";
        }
        if (aTeam.teamDivision.length === 0) {
            throw "Team division should not be empty";
        }
        if (aTeam.teamName.length === 0) {
            throw "Team name should not be empty";
        }
        if (aTeam.teamOrganization.length === 0) {
            throw "Team organization should not be empty";
        }
        if (aTeam.teamAvgScore < 0) {
            throw "Team average score should not be lower than zero";
        }
        // 检查team的division是否存在
        let validDivisionFlag = false;
        let divisions = this.db.getData().settings.division;
        for (let i = 0; i < divisions.length; i ++) {
            if (divisions[i].divisionName === aTeam.teamDivision) {
                validDivisionFlag = true;
                break;
            }
        }
        if (!validDivisionFlag) {
            throw "Team division does not exist";
        }
        // 添加并保存
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
