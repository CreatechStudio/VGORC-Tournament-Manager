import {Elysia} from "elysia";
import {db} from "../index";

export const utils = new Elysia()
    .group('/utils', (app) => app
        .get('database/existed', ({}) => db.isDatabaseExist())
    );
