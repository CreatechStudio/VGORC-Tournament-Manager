import {Utils} from "../Utils";
import {Data} from "../../../common/Data";
import {DivisionObject} from "../../../common/Division";

export class Division {
    data: DivisionObject[] = [];
    db: Utils = new Utils();

    _indexOf(divisionName: string) {
        this.data = this.db.getData().settings.division;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].divisionName === divisionName) {
                return i;
            }
        }
        return -1;
    }

    // Division A里不能有Division B里已经有的场地
    _newFieldsExistInOtherDivision(newFields: string[], index?: number,) {
        this.data = this.db.getData().settings.division;
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

    _hasMultipleSkillDivision() {
        let allDivision: DivisionObject[] = this.db.getData().settings.division;
        let skillDivisionCount: number = 0;
        allDivision.forEach(division => {
            if (division.isSkill) {
                skillDivisionCount ++;
            }
        })
        return skillDivisionCount >= 1;
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

        if (!this._newFieldsExistInAnyFieldSets(obj.divisionFields) && !obj.isSkill) {
            throw "Field name does not exist in field sets";
        }

        if (obj.isSkill && this._hasMultipleSkillDivision()) {
            throw "There can only be one skill division";
        }

        if (index === -1) {
            this.data.push(obj);
        } else {
            this.data[index] = obj;
        }
        this._update();
    }

    get() {
        return this.db.getData().settings.division.sort((a, b) => a.divisionName.localeCompare(b.divisionName));
    }

    getMatch() {
        return this.db.getData().settings.division.filter(division => !division.isSkill).sort((a, b) => a.divisionName.localeCompare(b.divisionName));
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
