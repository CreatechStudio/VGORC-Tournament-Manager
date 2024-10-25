import {licenseInfo} from './License';
import {machineIdSync} from "node-machine-id";
import {Elysia} from 'elysia';
import {swagger} from '@elysiajs/swagger';
import {cors} from "@elysiajs/cors";
import {logger} from '@bogeychan/elysia-logger';
import {authGroup, JWT_SECRET} from './Groups/Auth';
import {divisionGroup} from './Groups/Division';
import {fieldSetGroup} from './Groups/FieldSet';
import {matchGroup} from './Groups/Match';
import {periodGroup} from "./Groups/Period";
import {rankingGroup} from './Groups/Ranking';
import {skillGroup} from './Groups/Skills';
import {teamGroup} from './Groups/Team';
import {utilsGroup} from './Groups/Utils';
import dotenv from "dotenv";
import jwt from "@elysiajs/jwt";

dotenv.config()
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

if (!licenseInfo.isValid) {
    let machineIdValue = machineIdSync();
    console.log(`🔑 Your machine id is ${machineIdValue}`);
    console.log(`❌ Your license is invalid or expired. Application will terminate`);
    await delay(10000);
    process.exit(1);
} else {
    console.log('✅ License is valid');
    console.log('📅 License expire date:', licenseInfo.expireDate);
    console.log('🏢 Organization:', licenseInfo.organization);
}

const app = new Elysia()
    .use(swagger({
        documentation: {
            info: {
                title: 'VGORC TM Backend API Documentation',
                version: '1.0.0'
            }
        }
    }))
    .use(cors({
        origin: '*'
    }))
    .use(logger({
        stream: process.stdout,
        // level: "error",
    }))
    .use(
        jwt({
            name: 'jwt',
            secret: JWT_SECRET,
        })
    )
    .get('/', 'Welcome to VGORC TM API Backend')
    .use(authGroup)
    .use(divisionGroup)
    .use(fieldSetGroup)
    .use(matchGroup)
    .use(periodGroup)
    .use(rankingGroup)
    .use(skillGroup)
    .use(teamGroup)
    .use(utilsGroup)
    .post('/auth/:module', async ({ auth, jwt, cookie: { permission }, params ,body: {authRole, authPassword}}) => {
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
                path: '/auth/jwt/match'
            })
        }
        else if (params.module == 'match' && auth.checkAuth(authRole, authPassword))
            permission.set({
                value: await jwt.sign(params),
                httpOnly: true,
                maxAge: 5 * 86400,
                path: '/auth/jwt/match'
            });

        return permission.cookie;
    }, {
        body: t.Object({
            authRole: t.Number(),
            authPassword: t.String()
        }),
        params: t.Object({
            module: t.String()
        })
    })
    .listen(3000);

console.log(
    `🤖 VGORC TM API Backend is running at ${BASE_URL}`
);