import {Elysia} from "elysia";
import {Utils} from "../Database/Utils";

export const utilsGroup = new Elysia()
    .decorate('db', new Utils())
    .group('/utils', (app) => app
        .get('database/existed', ({ db }) => db.isDatabaseExist())
    );
