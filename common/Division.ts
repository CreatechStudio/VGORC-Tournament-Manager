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

    // Division A里不能有Division B里已经有的场地
    _newFieldsExistInOtherDivision(newFields: string[], index?: number,) {
        for (let i = 0; i < this.data.length; i ++) {
            for (let j = 0; j < newFields.length; j ++) {
                if (i !== index && this.data[i].divisionFields.includes(newFields[j])) {
                    return true;
                }
            }
        }
        return false;
    }

    _newFieldsExistInAnyFieldSets(newFields: string[]) {
        let allFields: string[] = [];
        let allExist: boolean = true
        this.db.getData().settings.fieldSets.forEach(fieldSet => {
            allFields = allFields.concat(fieldSet.fields);
        });
        for (let i = 0; i < newFields.length; i++) {
            if (!allFields.includes(newFields[i])) {
                allExist = false;
            }
        }
        return allExist;
    }

    add(obj: DivisionObject) {
        if (obj.divisionName.length === 0) {
            throw "Division name should not be empty";
        }
        if (new Set(obj.divisionFields).size !== obj.divisionFields.length) {
            throw "Fields cannot repeat";
        }

        let index = this._indexOf(obj.divisionName);
        if (this._newFieldsExistInOtherDivision(obj.divisionFields, index)) {
            throw "Field name already exists";
        }

        if (!this._newFieldsExistInAnyFieldSets(obj.divisionFields)) {
            throw "Field name does not exist in field sets";
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
            this._update();
        } else {
            throw "Division does not exist";
        }
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.settings.division = this.data;
        this.db.updateData(newData);
    }
}
