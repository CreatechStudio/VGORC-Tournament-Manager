import {Elysia, status} from "elysia";
import {Utils} from "../Utils";
import {checkJWT} from "../Runtime/Auth";

const MODULE_PERMISSION = "admin"

export const utilsGroup = new Elysia()
    .decorate('db', new Utils())
    .group('/utils', (app) => app
        .get('database/isLocked', ({ db }) => db.isDatabaseLocked())
        .guard(
            {
                async beforeHandle({ cookie: { permission } }) {
                    if (permission === undefined) {
                        return status(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, status);
                }
            },
            (app) => app
                .get('database/lock', ({ db }) => db.setDatabaseLock())
        )
    );
