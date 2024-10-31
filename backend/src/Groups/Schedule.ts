import {Elysia, error, t} from "elysia";
import {checkJWT} from "../runtime/Auth";
import {Schedule} from "../runtime/Schedule";

const MODULE_PERMISSION = "admin"

export const scheduleGroup = new Elysia()
    .decorate('schedule', new Schedule())
    .group('/schedule', (app) => app
        .get('', ({ schedule }) => schedule.get())
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, error)
                }
            },(app) => app
                .get('add', ({ schedule, error }) => {
                    try {
                        schedule.add();
                        return schedule.get();
                    } catch (e) {
                        return error(406, e);
                    }
                })
        )
    );