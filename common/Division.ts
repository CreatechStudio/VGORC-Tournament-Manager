export interface DivisionObject {
    divisionName: string,
    fields: string[]
}

export class Division {
    data: DivisionObject[] = [];

    constructor() {}

    add(divisionName: string) {
        if (this.data.includes(divisionName)) {
            throw "Division already exist";
        }
        if (divisionName.length === 0) {
            throw "Division name should not be empty";
        }
        this.data.push(divisionName);
    }

    get() {
        return this.data.sort();
    }

    delete(divisionName: string) {
        let index = this.data.indexOf(divisionName);
        if (index > -1) {
            this.data.splice(index, 1);
        } else {
            throw "Division does not exist";
        }
    }

}
