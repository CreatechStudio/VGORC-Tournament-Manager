import {Utils} from "../Utils";
import {Data} from "../../../common/Data";
import {DisplayObject} from "../../../common/Display";

export class Display {
    data: DisplayObject[] = [];
    db: Utils = new Utils();

    _indexOf(serial: string) {
        this.data = this.db.getData().settings.display;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].displaySerial === serial) {
                return i;
            }
        }
        return -1;
    }

    _isSerialExsit(serial: string) {
        this.data = this.db.getData().settings.display;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].displaySerial === serial) {
                return true;
            }
        }
        return false;
    }

    get() {
        this.data = this.db.getData().settings.display;
        return this.data;
    }

    new(obj: DisplayObject) {
        let allDisplay: DisplayObject[] = this.get();

        if (!this._isSerialExsit(obj.displaySerial)) {
            allDisplay.push(obj);
            this.data = allDisplay;
            this._update();
        }
    }

    update(obj: DisplayObject) {
        if (obj.displaySerial.length === 0) {
            throw "Display serial should not be empty";
        }

        let index = this._indexOf(obj.displaySerial);

        if (index === -1) {
            this.data.push(obj);
        } else {
            this.data[index] = obj;
        }
        this._update();

    }

    _update() {
        let newData: Data = this.db.getData();
        newData.settings.display = this.data;
        this.db.updateData(newData);
    }
}