import * as fs from 'fs';
import * as dotenv from 'dotenv';
import {Data, DEFAULT_DATA} from "../../../common/Data";

dotenv.config({ path: '../../.env' });

export class Utils {
    private readonly dbFile: string;
    data: Data = DEFAULT_DATA;

    constructor() {
        this.dbFile = process.env.DB_FILE || '';
        if (!this.dbFile) {
            throw new Error('DB_FILE is not defined in the .env file');
        }
        console.log(`Database file: ${this.dbFile}`);
        this.initDatabaseConnection();
    }

    isDatabaseExist() {
        return fs.existsSync(this.dbFile);
    }

    createTournamentDatabase() {
        if (!this.isDatabaseExist()) {
            fs.writeFileSync(this.dbFile, '');
            console.log('Utils created successfully');
        } else {
            console.log('Utils already exists');
        }
    }

    initDatabaseConnection() {
        if (!this.isDatabaseExist()) {
            this.createTournamentDatabase();
        } else {
            this.data = JSON.parse(fs.readFileSync(this.dbFile, 'utf-8') || JSON.stringify(this.data));
        }
    }

    updateData(newData: Data) {
        fs.writeFileSync(this.dbFile, JSON.stringify(newData, null, 4));
        this.data = newData;
    }
}
