import {Utils} from "../Utils";
import {Data} from "../../../common/Data";
import {PeriodObject} from "../../../common/Period";

export class Period {
    data: PeriodObject[] = [];
    db: Utils = new Utils();

    _indexOf(periodNumber: number) {
        this.data = this.db.getData().periods || [];
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].periodNumber === periodNumber) {
                return i;
            }
        }
        return -1;
    }

    _hasMatchesInPeriod(periodNumber: number, divisionName: string): boolean {
        let data = this.db.getData();
        let decodedDivisionName = decodeURIComponent(divisionName);
        let hasMatches = false;
        for (let i = 0; i < data.matches.length; i++) {
            let division = data.matches[i];
            if (division.divisionName === decodedDivisionName && division.matches) {
                for (let j = 0; j < division.matches.length; j++) {
                    let match = division.matches[j];
                    if (match.matchPeriod === periodNumber) {
                        hasMatches = true;
                        break;
                    }
                }
            }
            if (hasMatches) break;
        }
        return hasMatches;
    }

    _hasPeriodTimeOverlap(periodNumber: number, periodStartTime: string, periodEndTime: string): boolean {
        this.data = this.db.getData().periods || [];
        const newStartTime = new Date(periodStartTime);
        const newEndTime = new Date(periodEndTime);

        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].periodNumber !== periodNumber) {
                const startTime = new Date(this.data[i].periodStartTime);
                const endTime = new Date(this.data[i].periodEndTime);

                if ((newStartTime < endTime && newEndTime > startTime)) {
                    return true;
                }
            }
        }
        return false;
    }

    get() {
        return this.db.getData().periods;
    }

    add(periodNumber: number, periodType: string, periodStartTime: string, periodEndTime: string, periodMatchDuration: number) {
        const divisions = this.db.getData().settings.division;

        for (const division of divisions) {
            const divisionName = division.divisionName;
            if (this._hasMatchesInPeriod(periodNumber, divisionName)) {
                throw new Error(`Division ${divisionName} already has matches in period ${periodNumber}`);
            }
        }

        if (this._hasPeriodTimeOverlap(periodNumber, periodStartTime, periodEndTime)) {
            throw new Error(`Period ${periodNumber} has time overlap with other periods`);
        }

        if (periodMatchDuration < 1) {
            throw new Error(`Period match duration must be greater than 0`);
        }

        const newPeriod = {
            periodNumber,
            periodType,
            periodStartTime,
            periodEndTime,
            periodMatchDuration
        };

        const index = this._indexOf(periodNumber);
        if (index === -1) {
            this.data.push(newPeriod);
        } else {
            this.data[index] = newPeriod;
        }
        this._update();
    }

    delete(periodNumber: number) {
        const index = this._indexOf(periodNumber);
        if (index === -1) {
            throw new Error(`Period ${periodNumber} not found`);
        } else {
            this.data.splice(index, 1);
            this._update();
        }
    }

    _update() {
        let newData: Data = this.db.getData();
        newData.periods = this.data;
        this.db.updateData(newData);
    }
}
