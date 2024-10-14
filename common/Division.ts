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

    add(divisionName: string, fields: string[]) {
        if (divisionName.length === 0) {
            throw "Division name should not be empty";
        }
        if (this._indexOf(divisionName) !== -1) {
            throw `Division ${divisionName} already exists`;
        }
        if (new Set(fields).size !== fields.length) {
            throw "Fields cannot repeat";
        }
        for (let i = 0; i < this.data.length; i ++) {
            for (let j = 0; j < fields.length; j ++) {
                if (this.data[i].fields.includes(fields[j])) {
                    throw `Field ${fields[j]} already exists`;
                }
            }
        }
        this.data.push({
            divisionName,
            fields
        });
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
    }
}
