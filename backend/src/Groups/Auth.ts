import {Elysia, t} from "elysia";
import jwt from "@elysiajs/jwt";
import dotenv from 'dotenv';
import axios from 'axios';
import {BASE_URL} from "../index";
import {ElysiaCustomStatusResponse} from "elysia/dist/error";
import {Auth} from "../runtime/Auth";

dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET || 'Createch';

export const authGroup = new Elysia()
    .decorate('auth', new Auth())
    .group('/auth', (app) => app
        .get('jwt/:module', async ({ jwt, cookie: { permission } }) => {
            console.log(permission);
            const token = await jwt.verify(permission.value);
            return token !== false;
        })
    );

export async function verifyModule(module: string, cookie: string): Promise<boolean> {
    try {
        const response = await axios.get(`${BASE_URL}/auth/jwt/${module}`, { withCredentials: true });
        return response.data === true;
    } catch (error) {
        console.error('Error verifying module:', error);
        return false;
    }
}

export async function checkJWT(module: string, error: (code: number, response?: string) => ElysiaCustomStatusResponse<number, string>, cookie: string) {
    if (!await verifyModule(module, cookie)) {
        return error(401, 'Unauthorized')
    }
}
