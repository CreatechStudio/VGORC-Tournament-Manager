import {Utils} from "../Utils";
import axios from "axios";
import {BASE_URL} from "../index";
import {ElysiaCustomStatusResponse} from "elysia/dist/error";

export class Auth {
    db: Utils = new Utils();

    checkAuth(role: number, password : string): boolean {
        console.log(`Role is ${role}`)
        console.log(`Password is ${password}`)
        for (const auth of this.db.getData().auth) {
            if (auth.authRole === role && auth.authPasswordHash === password) {
                return true;
            }
        }
        return false;
    }
}

export async function verifyPermission(cookie: string, moudle: string): Promise<boolean> {
    try {
        const response = await axios.post(`${BASE_URL}/auth/check`, {
            cookie: cookie,
            module: moudle
        });
        return response.data === true;
    } catch (error) {
        console.error('Error verifying module:', error);
        return false;
    }
}

export async function checkJWT(cookie: string, moudle: string, error: (code: number, response?: string) => ElysiaCustomStatusResponse<number, string>) {
    if (!await verifyPermission(cookie, moudle)) {
        return error(401, 'Unauthorized')
    }
}