import {validLicenseKey} from "./License";
import {Elysia, t} from 'elysia';
import {swagger} from '@elysiajs/swagger';
import {cors} from "@elysiajs/cors";
import {logger} from '@bogeychan/elysia-logger';
import {adminGroup} from "./Groups/Admin";
import {divisionGroup} from './Groups/Division';
import {displayGroup} from "./Groups/Display";
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
const licenseInfo = await validLicenseKey();

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

if (licenseInfo !== null && licenseInfo.status ===  "granted") {
    console.log('✅ License is valid');
    console.log('📅 License expire date:', licenseInfo.expiresAt);
    console.log('🏢 Organization:', licenseInfo.customer.name);
} else {
    console.log('❌ License is invalid or not granted');
    console.log('Please contact Createch Support for more information.');
    console.log('License key:', process.env.TM_LICENSE_KEY);
    process.exit(1);
}

process.env.TM_VENDOR_LOGO = 'https://cdn.createchstudio.com/vgorc-tm/VEX%20GO%20Logo_Full%20Color.png,https://cdn.createchstudio.com/vgorc-tm/CreatechStudio.png,' + process.env.TM_VENDOR_LOGO;

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
        level: "error",
    }))
    .use(
        jwt({
            name: 'jwt',
            secret: JWT_SECRET,
        })
    )
    .get('/', () => {return  'Welcome to VGORC TM API Backend'})
    .get('/ping', () => {return 'Pong!'})
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
        const localEnv = process.env;
        Object.keys(localEnv).forEach(key => {
            if (key.startsWith(prefix)) {
                env[key] = localEnv[key] || "";
            }
        });
        ['TM_JWT_SECRET', 'TM_ADMIN_PASSWORD', 'TM_REFEREE_PASSWORD'].forEach(key => {
            if (key in env) {
                delete env[key];
            }
        });
        return env;
    }, {
        params: t.Object({
            prefix: t.String()
        })
    })
    .use(adminGroup)
    .use(displayGroup)
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