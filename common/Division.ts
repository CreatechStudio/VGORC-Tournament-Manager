import {Data} from "./Data";
import {Utils} from "../backend/src/Database/Utils";

export interface DivisionObject {
    divisionName: string,
    divisionFields: string[]
}

export class Division {
    data: DivisionObject[] = [];
    db: Utils = new Utils();

    constructor() {
        this.data = this.db.getData().settings.division;
    }

    _indexOf(divisionName: string) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].divisionName === divisionName) {
                return i;
            }
        }
        return -1;
    }

    _newFieldsExist(newFields: string[], index?: number,) {
        for (let i = 0; i < this.data.length; i ++) {
            for (let j = 0; j < newFields.length; j ++) {
                if (i !== index && this.data[i].divisionFields.includes(newFields[j])) {
                    return true;
                }
            }
        }
        return false;
    }

    add(obj: DivisionObject) {
        if (obj.divisionName.length === 0) {
            throw "Division name should not be empty";
        }
        if (new Set(obj.divisionFields).size !== obj.divisionFields.length) {
            throw "Fields cannot repeat";
        }

        let index = this._indexOf(obj.divisionName);
        if (this._newFieldsExist(obj.divisionFields, index)) {
            throw "Field name already exists";
        }

        if (index === -1) {
            this.data.push(obj);
        } else {
            this.data[index] = obj;
        }
        this._update();
    }

    get() {
        return this.db.getData().settings.division;
    }

    delete(divisionName: string) {
        let index = this._indexOf(divisionName);
        if (index > -1) {
            this.data.splice(index, 1);
        } else {
            throw "Division does not exist";
        }
        this._update();
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.settings.division = this.data;
        this.db.updateData(newData);
    }
}
