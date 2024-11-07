import {licenseInfo} from './License';
import {machineIdSync} from "node-machine-id";
import {Elysia, t} from 'elysia';
import {swagger} from '@elysiajs/swagger';
import {cors} from "@elysiajs/cors";
import {logger} from '@bogeychan/elysia-logger';
import {divisionGroup} from './Groups/Division';
import {fieldSetGroup} from './Groups/FieldSet';
import {matchGroup} from './Groups/Match';
import {periodGroup} from "./Groups/Period";
import {rankingGroup} from './Groups/Ranking';
import {scheduleGroup} from "./Groups/Schedule";
import {skillGroup} from './Groups/Skills';
import {teamGroup} from './Groups/Team';
import {timerGroup} from "./Groups/Timer";
import {utilsGroup} from './Groups/Utils';
import dotenv from "dotenv";
import jwt from "@elysiajs/jwt";
import {Auth} from "./runtime/Auth";

dotenv.config()
export const BASE_URL = process.env.TM_BASE_URL || 'http://localhost:3000';
export const WEB_URL = process.env.TM_WEB_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.TM_JWT_SECRET || 'Createch';

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

new Elysia()
    .use(swagger({
        documentation: {
            info: {
                title: 'VGORC TM Backend API Documentation',
                version: '1.0.0'
            }
        }
    }))
    .use(cors({
        origin: WEB_URL,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Origin', 'Cookie', 'Accept']
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
    .decorate('auth', new Auth())
    .post('/auth/:module', async ({ auth, jwt, cookie: { permission }, params ,body: {authRole, authPassword}}) => {
        if (auth.checkAuth(authRole, authPassword)) {
            permission.set({
                value: await jwt.sign(params),
                httpOnly: true,
                maxAge: 5 * 86400,
            })
        }
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
    .post("/auth/check", async ({ jwt, body }) => {
        const token = await jwt.verify(body.cookie);
        // @ts-ignore
        if (token.module === 'admin') {
            return true;
        }
        // @ts-ignore
        return token.module === body.module;
    }, {
        body: t.Object({
            module: t.String(),
            cookie: t.String()
        })
    })
    .get('/env/:prefix', async ({params: {prefix}}) => {
        let env: {[Keys: string]: string} = {};
        process.env.TM_VENDOR_LOGO = 'https://cdn.createchstudio.com/vgorc-tm/CreatechStudio.png,https://cdn.createchstudio.com/vgorc-tm/VEX%20GO%20Logo_Full%20Color.png,' + process.env.TM_VENDOR_LOGO;
        const localEnv = process.env;
        Object.keys(localEnv).forEach(key => {
            if (key.startsWith(prefix)) {
                env[key] = localEnv[key] || "";
            }
        });
        return env;
    }, {
        params: t.Object({
            prefix: t.String()
        })
    })
    .use(divisionGroup)
    .use(fieldSetGroup)
    .use(matchGroup)
    .use(periodGroup)
    .use(rankingGroup)
    .use(scheduleGroup)
    .use(skillGroup)
    .use(teamGroup)
    .use(timerGroup)
    .use(utilsGroup)
    .listen(3000);

console.log(
    `🤖 VGORC TM API Backend is running at ${BASE_URL}`
);