import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export class Utils {
    private readonly dbFile: string;

    constructor() {
        this.dbFile = process.env.DB_FILE || '';
        if (!this.dbFile) {
            throw new Error('DB_FILE is not defined in the .env file');
        }
        console.log(`Database file: ${this.dbFile}`);
        this.initDatabaseConnection()
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
        }
    }

    readDatabaseKey(key: string) {
        const dbContent = fs.readFileSync(this.dbFile, 'utf8');
        const db = JSON.parse(dbContent);
        return db[key];
    }
}
