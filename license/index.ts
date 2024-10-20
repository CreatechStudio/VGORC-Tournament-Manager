import * as fs from 'fs';
import * as path from 'path';
import NodeRSA from 'node-rsa';

const privateKeyPath = path.join(__dirname, 'private.key');
const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');

const key = new NodeRSA();
key.importKey(privateKey, 'private');

const licenseData = {
    expireDate: '2024-12-31',
    organization: 'Shanghai JiaoTong University',
    machineId: 'ac55ff07acdb72bf1acc5b65090a2bcee737740cd32a298f9894e8d2bbafe1e2'
};

const encryptedLicense = key.encryptPrivate(JSON.stringify(licenseData), 'base64');
fs.writeFileSync(path.join(__dirname, `${licenseData.organization}.license`), encryptedLicense);

console.log('License file generated and encrypted successfully.');
process.exit(0);