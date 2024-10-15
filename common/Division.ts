import {db} from "../backend/src";
import {Data} from "./Data";

export interface DivisionObject {
    divisionName: string,
    fields: string[]
}

export class Division {
    data: DivisionObject[] = [];

    constructor() {}

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
                if (i !== index && this.data[i].fields.includes(newFields[j])) {
                    return true;
                }
            }
        }
        return false;
    }

    add(divisionName: string, fields: string[]) {
        if (divisionName.length === 0) {
            throw "Division name should not be empty";
        }
        if (new Set(fields).size !== fields.length) {
            throw "Fields cannot repeat";
        }

        let index = this._indexOf(divisionName);
        if (this._newFieldsExist(fields, index)) {
            throw "Field name already exists";
        }

        if (index === -1) {
            this.data.push({
                divisionName,
                fields
            });
        } else {
            this.data[index] = {
                divisionName,
                fields
            }
        }
        this._update();
    }

    get() {
        return this.data.sort();
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
        let newData: Data = JSON.parse(JSON.stringify(db.data));
        newData.settings.division = this.data;
        db.updateData(newData);
    }
}
