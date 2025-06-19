import * as fs from 'fs';
import {Data, DEFAULT_DATA} from "../../common/Data";
import dotenv from 'dotenv';
import {sha256} from "js-sha256";
import dayjs from "dayjs";
import path from 'path';
import crypto from 'crypto';

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

    backupDatabase() {
        const dbDir = path.dirname(this.dbFile);
        const backupDir = path.join(dbDir, 'backup');

        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // 读取最新备份文件（按文件名排序，最新的在最后）
        const backupFiles = fs.readdirSync(backupDir)
            .filter(file => file.endsWith('.vgorc'))
            .sort(); // 默认是字母排序，按时间文件名也可

        const latestBackupFile = backupFiles.length > 0
            ? path.join(backupDir, backupFiles[backupFiles.length - 1])
            : null;

        if (!this._isDatabaseExist()) {
            console.log('No database file to backup');
            return null;
        }

        // 如果存在旧备份，且内容一致，则不备份
        if (latestBackupFile && this._areFilesIdentical(this.dbFile, latestBackupFile)) {
            console.log('No changes detected. Backup skipped.');
            return null;
        }
        const currentTime = dayjs().format('YYYY-MM-DD-HH-mm-ss');
        const backupFile = path.join(backupDir, `${currentTime}.vgorc`);
        fs.copyFileSync(this.dbFile, backupFile);
        return backupFile;
    }

    _areFilesIdentical(fileA: string, fileB: string): boolean {
        const hashFile = (filePath: string) => {
            const data = fs.readFileSync(filePath);
            return crypto.createHash('sha256').update(data).digest('hex');
        };

        try {
            const hashA = hashFile(fileA);
            const hashB = hashFile(fileB);
            return hashA === hashB;
        } catch (e) {
            console.warn('File comparison failed:', e);
            return false;
        }
    }
}
