import {Elysia, t} from "elysia";
import {Auth} from "../../../common/Auth";
import jwt from "@elysiajs/jwt";
import dotenv from 'dotenv';

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
            if (params.module == 'admin' && auth.checkAuth(authRole, authPassword))
                permission.set({
                    value: await jwt.sign(params),
                    httpOnly: true,
                    maxAge: 5 * 86400,
                    path: '/admin',
                });
            else if (params.module == 'match' && auth.checkAuth(authRole, authPassword))
                permission.set({
                    value: await jwt.sign(params),
                    httpOnly: true,
                    maxAge: 5 * 86400,
                    path: '/match'
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
    );