import {Elysia, t} from "elysia";
import {Auth} from "../../../common/Auth";
import {ip} from "elysia-ip";

export const authGroup = new Elysia()
    .decorate('auth', new Auth())
    .group('/auth', (app) => app
        .use(ip())
        .get('', ({ ip, auth }) => auth.checkAuth(ip))
    );