import {Elysia} from "elysia";
import {Utils} from "../Database/Utils";

export const utils = new Elysia()
    .decorate('utils', new Utils())
    .group('/utils', (app) => app
        .get('database/existed', ({ utils }) => utils.isDatabaseExist())
    );