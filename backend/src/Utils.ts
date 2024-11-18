import * as fs from 'fs';
import {Data, DEFAULT_DATA} from "../../common/Data";
import dotenv from 'dotenv';
import {sha256} from "js-sha256";

dotenv.config();
const adminPasswordHash = sha256(process.env.TM_ADMIN_PASSWORD || '123456');
const refereePasswordHash = sha256(process.env.TM_REFEREE_PASSWORD || '123456')

export class Utils {
    private readonly dbFile: string;
    private data: Data = DEFAULT_DATA;

    constructor() {
        this.dbFile = process.env.TM_DB_FILE || '';
        if (!this.dbFile) {
            throw "TM_DB_FILE is not defined in the .env file";
        }
        // console.log(`Database file: ${this.dbFile}`);
        this.initDatabaseConnection();
    }

    _isDatabaseExist() {
        return fs.existsSync(this.dbFile) && fs.readFileSync(this.dbFile).length !== 0;
    }

    isDatabaseLocked() {
        if (process.env.TM_DEV_ALWAYS_UNLOCK) {
            return false;
        }
        return this.getData().locked;
    }

    setDatabaseLock() {
        let newData: Data = this.getData();
        newData.locked = true;
        this.updateData(newData);
    }

    initAuth(adminHash: string, refereeHash: string) {
        let newData: Data = this.getData();
        newData.auth = [
            { authRole: 0, authPasswordHash: adminHash },
            { authRole: 1, authPasswordHash: refereeHash }
        ];
        this.updateData(newData);
    }

    createTournamentDatabase() {
        if (!this._isDatabaseExist()) {
            fs.writeFileSync(this.dbFile, JSON.stringify(DEFAULT_DATA, null, 4));
            console.log('Utils created successfully with default data');
            this.initAuth(adminPasswordHash, refereePasswordHash);
            console.log('Auth updated successfully');
        } else {
            console.log('Utils already exists');
        }
    }

    initDatabaseConnection() {
        if (!this._isDatabaseExist()) {
            this.createTournamentDatabase();
        }
    }

    getData(): Data {
        this.data = JSON.parse(fs.readFileSync(this.dbFile, 'utf-8') || JSON.stringify(this.data));
        return this.data;
    }

    updateData(newData: Data) {
        fs.writeFileSync(this.dbFile, JSON.stringify(newData, null, 4));
        this.data = newData;
    }
}
