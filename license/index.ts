import * as fs from 'fs';
import * as path from 'path';
import NodeRSA from 'node-rsa';

const privateKeyPath = path.join(__dirname, 'private.key');
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');

const key = new NodeRSA();
key.importKey(privateKey, 'private');

const licenseData = {
    expireDate: process.env.EXPIRE_DATE,
    organization: process.env.ORGANIZATION,
    machineId: process.env.MACHINE_ID
};

const encryptedLicense = key.encryptPrivate(JSON.stringify(licenseData), 'base64');
fs.writeFileSync(path.join(__dirname, `${licenseData.organization}.license`), encryptedLicense);

console.log('License file generated and encrypted successfully.');
process.exit(0);