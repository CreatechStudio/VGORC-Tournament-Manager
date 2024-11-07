import {Elysia} from "elysia";
import {Utils} from "../Utils";

export const utilsGroup = new Elysia()
    .decorate('db', new Utils())
    .group('/utils', (app) => app
        .get('database/isLocked', ({ db }) => db.isDatabaseLocked())
        .get('database/lock', ({ db }) => db.setDatabaseLock())
    );
