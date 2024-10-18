import {Data} from "./Data";
import {Utils} from "../backend/src/Database/Utils";

export enum AuthRole {
    Admin,
    Referee,
    Guest
}

export interface AuthObject {
    authRole: AuthRole,
    authPasswordHash: string
}

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