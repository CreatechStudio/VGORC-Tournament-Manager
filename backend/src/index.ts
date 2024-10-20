import { licenseInfo } from './License/Valid';
import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { divisionGroup } from './Groups/Division';
import { teamGroup } from './Groups/Team';
import { utilsGroup } from './Groups/Utils';
import { authGroup } from './Groups/Auth';
import { rankingGroup } from './Groups/Ranking';
import { fieldSetGroup } from './Groups/FieldSet';
import { matchGroup } from './Groups/Match';
import { skillGroup } from './Groups/Skills';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

if (!licenseInfo.isValid) {
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
    .get('/', 'Welcome to VGORC TM API Backend')
    .use(authGroup)
    .use(divisionGroup)
    .use(fieldSetGroup)
    .use(matchGroup)
    .use(rankingGroup)
    .use(skillGroup)
    .use(teamGroup)
    .use(utilsGroup)
    .listen(3000);

console.log(
    `🤖 VGORC TM API Backend is running at http://${app.server?.hostname}:${app.server?.port}`
);