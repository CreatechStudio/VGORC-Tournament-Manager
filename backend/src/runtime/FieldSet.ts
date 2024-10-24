import {Utils} from "../Utils";
import {Data} from "../../../common/Data";
import {FieldSetObject} from "../../../common/FieldSet";

export class FieldSet {
    data: FieldSetObject[] = [];
    db: Utils = new Utils();

    constructor() {
        this.data = this.db.getData().settings.fieldSets;
    }

    _indexOf(fieldSetId: number) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].fieldSetId === fieldSetId) {
                return i;
            }
        }
        return -1;
    }

    _newFieldsExist(newFields: string[], index?: number) {
        for (let i = 0; i < this.data.length; i ++) {
            for (let j = 0; j < newFields.length; j ++) {
                if (i !== index && this.data[i].fields.includes(newFields[j])) {
                    return true;
                }
            }
        }
        return false;
    }

    add(aSet: FieldSetObject) {
        if (this._newFieldsExist(aSet.fields)) {
            throw "Fields already exists";
        }

        const index = this._indexOf(aSet.fieldSetId);
        if (index !== -1) {
            this.data[index] = aSet;
        } else {
            this.data.push(aSet);
        }

        this._update();
    }

    get() {
        return this.db.getData().settings.fieldSets;
    }

    delete(setId: number) {
        const index = this._indexOf(setId);
        if (index !== -1) {
            this.data.splice(index, 1);
            this._update();
        } else {
            throw "Field set does not exist";
        }
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.settings.fieldSets = this.data;
        this.db.updateData(newData);
    }
}
