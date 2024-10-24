import {Elysia, t} from "elysia";
import {Auth} from "../../../common/Auth";
import jwt from "@elysiajs/jwt";
import dotenv from 'dotenv';
import axios from 'axios';
import {BASE_URL} from "../index";
import {ElysiaCustomStatusResponse} from "elysia/dist/error";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'Createch';

export const authGroup = new Elysia()
    .decorate('auth', new Auth())
    .group('/auth', (app) => app
        .use(
            jwt({
                name: 'jwt',
                secret: JWT_SECRET,
            })
        )
        .post(':module', async ({ auth, jwt, cookie: { permission }, params ,body: {authRole, authPassword}}) => {
            if (params.module == 'admin' && auth.checkAuth(authRole, authPassword)) {
                permission.set({
                    value: await jwt.sign(params),
                    httpOnly: true,
                    maxAge: 5 * 86400,
                    path: '/auth/jwt/admin'
                })
                permission.set({
                    value: await jwt.sign(params),
                    httpOnly: true,
                    maxAge: 5 * 86400,
                    path: '/auth/jwt/admin'
                })
            }
            else if (params.module == 'match' && auth.checkAuth(authRole, authPassword))
                permission.set({
                    value: await jwt.sign(params),
                    httpOnly: true,
                    maxAge: 5 * 86400,
                    path: '/auth/jwt/match'
                });

            return permission.value !== undefined;
        }, {
            body: t.Object({
                authRole: t.Number(),
                authPassword: t.String()
            }),
            params: t.Object({
                module: t.String()
            })
        })
        .get('jwt/:module', async ({ jwt, cookie: { permission } }) => {
            const token = await jwt.verify(permission.value)

            if (!token) {
                return false
            }

            return true
        })
    );

export async function verifyModule(module: string): Promise<boolean> {
    try {
        const response = await axios.get(`${BASE_URL}/auth/jwt/${module}`, { withCredentials: true });
        return response.data === true;
    } catch (error) {
        console.error('Error verifying module:', error);
        return false;
    }
}

export async function checkJWT(module: string, error: (code: number, response?: string) => ElysiaCustomStatusResponse<number, string>) {
    if (!await verifyModule(module)) {
        return error(401, 'Unauthorized')
    }
}
