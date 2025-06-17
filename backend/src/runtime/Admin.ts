import {Utils} from "../Utils";
import {Data} from "../../../common/Data";
import {AdminObject} from "../../../common/Admin";

export class Admin {
    data: AdminObject = {
        playerDuration: 0,
        eliminationAllianceCount: 0,
        matchGoals: {}
    };
    db: Utils = new Utils();

    add(obj: AdminObject) {
        if (parseInt(obj.playerDuration.toString()) <= 0 || parseInt(obj.eliminationAllianceCount.toString()) <= 0) {
            throw "Player duration and elimination alliance count should be an integer";
        }

        if (obj.playerDuration <= 0 && obj.eliminationAllianceCount <= 0) {
            throw "Player duration and elimination alliance count should be greater than 0";
        }

        this.data = obj;
        this._update()
    }

    get() {
        this.data = this.db.getData().settings.adminData;
        return this.data
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.settings.adminData = this.data;
        this.db.updateData(newData);
    }
}