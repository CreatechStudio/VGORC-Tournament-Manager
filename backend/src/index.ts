import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import {divisionGroup} from "./Groups/Division";
import {teamGroup} from "./Groups/Team";
import {utilsGroup} from "./Groups/Utils";
import {authGroup} from "./Groups/Auth";
import {rankingGroup} from "./Groups/Ranking";
import {fieldSetGroup} from "./Groups/FieldSet";
import {matchGroup} from "./Groups/Match";

const app = new Elysia()
    .use(swagger({
        documentation: {
            info: {
                title: 'VGORC TM Backend API Documentation',
                version: '1.0.0'
            }
        }
    }))
    .get('/', 'Welcome to VGORC TM API Backend')
    .use(authGroup)
    .use(divisionGroup)
    .use(matchGroup)
    .use(rankingGroup)
    .use(teamGroup)
    .use(fieldSetGroup)
    .use(utilsGroup)
    .listen(3000);

console.log(
    `🤖 VGORC TM API Backend is running at http://${app.server?.hostname}:${app.server?.port}`
);
