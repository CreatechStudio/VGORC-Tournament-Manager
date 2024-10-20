import * as fs from 'fs';
import NodeRSA from 'node-rsa';
import { machineIdSync } from 'node-machine-id';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const activationFilePath = process.env.LICENSE_FILE || 'license.license';

let isValid = false;
let expireDate = null;
let organization = null;

async function getNetworkTime() {
    const response = await fetch('http://worldtimeapi.org/api/ip');
    if (!response.ok) {
        throw new Error('Failed to fetch network time');
    }
    const data = await response.json();
    return new Date(data.utc_datetime);
}

async function validateLicense() {
    try {
        const publicKey = '-----BEGIN PUBLIC KEY-----\n' +
            'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKrtxy3gyMSgpxC74YwFHKgrnHUpvrul\n' +
            '31ymHTibB1SJ8dw59I8N7GFsDPZ6PepDPrFJ992KQAdVx42c9RaIf+sCAwEAAQ==\n' +
            '-----END PUBLIC KEY-----';
        const encryptedLicense = fs.readFileSync(activationFilePath, 'utf-8');

        const key = new NodeRSA();
        key.importKey(publicKey, 'public');

        const decryptedLicense = key.decryptPublic(encryptedLicense, 'utf-8');
        const licenseData = JSON.parse(decryptedLicense);

        const currentDate = await getNetworkTime();
        expireDate = new Date(licenseData.expireDate);
        const currentMachineId = machineIdSync();

        isValid = currentDate <= expireDate && licenseData.machineId === currentMachineId;
        organization = licenseData.organization;
    } catch (error) {
        console.error('Error validating license:', error.message);
        let machineIdValue = machineIdSync();
        console.log(`🔑 Your machine id is ${machineIdValue}`);
        console.log(`❌ Your license is invalid or expired. Application will terminate`);
    }
}

await validateLicense();

export const licenseInfo = {
    isValid,
    expireDate,
    organization
};