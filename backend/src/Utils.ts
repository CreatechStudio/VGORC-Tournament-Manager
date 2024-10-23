import * as fs from 'fs';
import {Data, DEFAULT_DATA} from "../../common/Data";
import dotenv from 'dotenv';

dotenv.config();

export class Utils {
    private readonly dbFile: string;
    private data: Data = DEFAULT_DATA;

    constructor() {
        this.dbFile = process.env.DB_FILE || '';
        if (!this.dbFile) {
            throw new Error('DB_FILE is not defined in the .env file');
        }
        // console.log(`Database file: ${this.dbFile}`);
        this.initDatabaseConnection();
    }

    _isDatabaseExist() {
        return fs.existsSync(this.dbFile) && fs.readFileSync(this.dbFile).length !== 0;
    }

    isDatabaseExist() {
        if (process.env.DEV_ALWAYS_UNLOCK) {
            return false;
        }
        return this._isDatabaseExist();
    }

    createTournamentDatabase() {
        if (!this._isDatabaseExist()) {
            fs.writeFileSync(this.dbFile, JSON.stringify(DEFAULT_DATA, null, 4));
            console.log('Utils created successfully with default data');
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
