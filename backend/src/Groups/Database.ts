import {Elysia, t} from "elysia";
import {Database} from "../Database/database";

export const database = new Elysia()
    .decorate('database', new Database())
    .group('/basic', (app) => app
        .get('initialized', )