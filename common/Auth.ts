import {Data} from "./Data";
import {Utils} from "../backend/src/Database/Utils";

export interface AuthObject {
    authIP: string,
    authRole: string,
}

export class Auth {
    data: AuthObject[] = [];
    db: Utils = new Utils();

    constructor() {
        this.data = this.db.getData().auth;
    }

    checkAuth(authIP: string): AuthObject {
        console.log(authIP)
        for (const auth of this.data) {
            if (auth.authIP === authIP) {
                return auth;
            }
        }
        return {authIP: "", authRole: ""};
    }
}