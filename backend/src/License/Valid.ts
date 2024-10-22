import * as fs from 'fs';
import https from 'https';
// @ts-ignore
import NodeRSA from 'node-rsa';
import { machineIdSync } from 'node-machine-id';
import dotenv from 'dotenv';

dotenv.config();

const activationFilePath = process.env.LICENSE_FILE || 'license.license';

let isValid = false;
let expireDate = null;
let organization = null;

async function getNetworkTime() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'license.createchstudio.com',
            port: 443,
            path: '/',
            method: 'GET',
            key: '-----BEGIN PRIVATE KEY-----\n' +
                'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDKf8bU/e1CTOxc\n' +
                'zClA3gr4JMZ/bcJWRNywVAo7QYhZtSecj3cQc5pHhI7ubI0v3j9JopG0Fm+lSRgm\n' +
                '95i76+d6qOOYG2B3JpKpQI4K3twgTsX18PUvlznmDVYyxGgTUflVngy+Fdbi0/fG\n' +
                'yyOH0x/sbhtvnUiqRrxOgX0WWk90FV20HcpnWwE1GAnZ5Dit9YtQrF/M5wCzlkgr\n' +
                'xQ/Ca5suVbB8P/KSbQRvkaXFOEpxi3/EGZ8BsbuZ+0Xe+IQsBDHgWS6Q77SF5w/M\n' +
                'He13va+y27Mp2/3rURz1VU3Aedae4GwbOpSZSgtC0Ht1M11n+dP4TiyfrTawv1EF\n' +
                'lMWVO8AdAgMBAAECggEAB+aWXmcN48FWk4RPs702Flpw+DXTGESVi7ersoYrCLz9\n' +
                'r6kVTyoDgfjVDs5jb9OvCnNyVeFuN7ezXonYhrR8kpeWUa/3wo5ZuIrRP/FUC1qn\n' +
                'dKITHuk6lBQ/IbnyCZbwMHv7KUt21+DHURVJ7Jm7LCFbpq4vUJ1z6Wg59i5N3UyK\n' +
                'TW+gHbZzCv3IZfExzAZenIEcogAPOL7TMxypHDAVh5cADUhChMajL/zT7ppemglT\n' +
                'vL05JW3CpEooxMIeKLll+0YWs8jid4UuC2s5OZa18SfhIdR/0E0pz9jYmHI8Bi06\n' +
                '/nIRXw8auFJyVsYwb+8vyz4DLtTZb21amXbGXdZETQKBgQDzyg+lGMpnzs9/TXfO\n' +
                'fUm2sox/YQivyCdja0W844F6LNsoKVz1olmKBA+kAm1QLJnrSmnfw8SJGC2KfIaP\n' +
                '4wjuINTe08QKruGeUFle+x4cg1MlUknoCKn/lTGzGhOHu24QU6uPPkYzBND9tW+u\n' +
                'VSBkK8k/P+RdXg4kwcoSrIA5IwKBgQDUpEfbr9KAOdlFmGDTyrwvow7XzNATxHud\n' +
                'LKNX/e52VqAcxP09HAMQCGPhLf0ECkg0QYZPWHeNaJgQMTLjey9BRys1nvn65PkS\n' +
                'gyZOh9fJqbHGCXdKKqOzDMaNATkbr/X+5zCHS4ygiMTbPI7M/xBUBgGH3u4qfZA7\n' +
                'TPcRW83VvwKBgQCT4i/JW5d0jyypsYmKlc/AZuD5aBhH4WebVHhSU8O4JDuxSh4c\n' +
                '1yXvpfUC7YH4D4YzB8nftjajXypJBq7t27AQG5RlsxoJzPoJ+f2sszIZ48PtMNSq\n' +
                'T48n/g3O8nOEc7sZZlf8pa8ZxcMtFAGyQ+tJOJJ0rsJNrP9xZqi42TFS9wKBgQCF\n' +
                'UvenG6dtNFgxVagoQu4ZJDCTR9yS+FfVJX7JFfLlCc1cHHr3TM/yxn/xWQdR+Cxr\n' +
                'b0YKC9rxs8ncJSzWCo+Ha1sBRMtR7yzn2Yk0JeI7lAVduOOtgeyfv/vhvwmSfZJM\n' +
                'n6ICwnDK2tYq695RU/9l31ooWbOUuqOrOseSf7AgOwKBgDKAaGxwzTlQ4PcAEiR9\n' +
                'z36KVTQywTOcS7GXCdT8IGL/YwM0ayRsgimtXLSLpy9CQL2TWF7tLaqJAIJXSp7D\n' +
                'kO2S9DSqIv0oixhnC76h+ZJCObU7pbnrmgrbd1whYqIac7+hztAk9X0PBVLMRT+1\n' +
                'xrDOl6YY/ZJrchJn1xkDsM2m\n' +
                '-----END PRIVATE KEY-----',
            cert: '-----BEGIN CERTIFICATE-----\n' +
                'MIIEFTCCAv2gAwIBAgIUezVmrMss9thynDEul2NjiyT+Om4wDQYJKoZIhvcNAQEL\n' +
                'BQAwgagxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQH\n' +
                'Ew1TYW4gRnJhbmNpc2NvMRkwFwYDVQQKExBDbG91ZGZsYXJlLCBJbmMuMRswGQYD\n' +
                'VQQLExJ3d3cuY2xvdWRmbGFyZS5jb20xNDAyBgNVBAMTK01hbmFnZWQgQ0EgODJl\n' +
                'MzlkY2Q4NjQ3MTdhZDI5M2E4ODUwNTIzOGIzNjQwHhcNMjQxMDIwMTI1MjAwWhcN\n' +
                'MzkxMDE3MTI1MjAwWjAiMQswCQYDVQQGEwJVUzETMBEGA1UEAxMKQ2xvdWRmbGFy\n' +
                'ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMp/xtT97UJM7FzMKUDe\n' +
                'Cvgkxn9twlZE3LBUCjtBiFm1J5yPdxBzmkeEju5sjS/eP0mikbQWb6VJGCb3mLvr\n' +
                '53qo45gbYHcmkqlAjgre3CBOxfXw9S+XOeYNVjLEaBNR+VWeDL4V1uLT98bLI4fT\n' +
                'H+xuG2+dSKpGvE6BfRZaT3QVXbQdymdbATUYCdnkOK31i1CsX8znALOWSCvFD8Jr\n' +
                'my5VsHw/8pJtBG+RpcU4SnGLf8QZnwGxu5n7Rd74hCwEMeBZLpDvtIXnD8wd7Xe9\n' +
                'r7Lbsynb/etRHPVVTcB51p7gbBs6lJlKC0LQe3UzXWf50/hOLJ+tNrC/UQWUxZU7\n' +
                'wB0CAwEAAaOBuzCBuDATBgNVHSUEDDAKBggrBgEFBQcDAjAMBgNVHRMBAf8EAjAA\n' +
                'MB0GA1UdDgQWBBTu/0dzE5g1RHg6+fAsQtGUeI7mFDAfBgNVHSMEGDAWgBSsLrUj\n' +
                'GcMRv8e1OWYy3UB+stQriTBTBgNVHR8ETDBKMEigRqBEhkJodHRwOi8vY3JsLmNs\n' +
                'b3VkZmxhcmUuY29tLzBiOGFlMTA3LTAyMjAtNGIyYy04NDExLTQ5NWU1MGUxN2Qx\n' +
                'Ny5jcmwwDQYJKoZIhvcNAQELBQADggEBAFOBWbzi1SiwLw7lW/cAeO0ISQuPVfAO\n' +
                'ThXXEoi2FbZbTUgK0BvvkY0qRxMu7Pgrb6FeNNv7aw19FTxSsA4ztbb7zcztmyt1\n' +
                'WHQ3iO4sljCz66+aPQJIL+F4iwdIEqV/FlGTucDTXMdAGPWqHl5EeplhVJ0MT1m7\n' +
                '+Np+g8ivABqJxXp6MXH9Ocn4XgLgcnO2qhShjKt8gj+ZuRHI/V/Pv/2oprcLJs3f\n' +
                'hWRr6tqfrMDsDogpAZ4Sg9M5C6TZDih/YGSq7e348mffrahQ9y+bqWpwGZIggTqC\n' +
                'oRxeXBauElpmcayhXnTwmDlsV267tgl5+m0NcXCW0nRHKg0LiyK+38E=\n' +
                '-----END CERTIFICATE-----'
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const jsonData = JSON.parse(data);
                    resolve(new Date(jsonData.utc_datetime));
                } else {
                    reject(new Error('Failed to fetch network time'));
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
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

        // @ts-ignore
        isValid = currentDate <= expireDate && licenseData.machineId === currentMachineId;
        organization = licenseData.organization;
    } catch (error) {
        // @ts-ignore
        console.error('Error validating license:', error.message);
        let machineIdValue = machineIdSync();
        console.log(`🔑 Your machine id is ${machineIdValue}`);
        console.log(`❌ Your license is invalid or expired. Application will terminate`);
        process.exit(1)
    }
}

await validateLicense();

export const licenseInfo = {
    isValid,
    expireDate,
    organization
};