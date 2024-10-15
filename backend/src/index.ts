import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import {division} from "./Groups/Division";
import {team} from "./Groups/Team";
import {utils} from "./Groups/Utils";
import {Utils} from "./Database/Utils";

export const db = new Utils();

const app = new Elysia()
    .use(swagger({
        documentation: {
            info: {
                title: 'VGORC TM Backend API Documentation',
                version: '1.0.0'
            }
        }
    }))
    .get('/', 'Welcome to VGORC TM Backend')
    .use(division)
    .use(team)
    .use(utils)
    .listen(3000);

console.log(
    `🦊 VGORC TM Backend is running at http://${app.server?.hostname}:${app.server?.port}`
);
