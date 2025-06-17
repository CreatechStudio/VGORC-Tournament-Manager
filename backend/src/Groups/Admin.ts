import {Elysia, error, t} from "elysia";
import {checkJWT} from "../runtime/Auth";
import {Admin} from "../runtime/Admin";

const MODULE_PERMISSION = "admin"

const MatchGoal = t.Object({
    name: t.String(),
    points: t.Number()
});

export const adminGroup = new Elysia()
    .decorate('admin', new Admin())
    .group('/admin', (app) => app
        .get('', ({ admin }) => admin.get())
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, error)
                }
            }, (app) => app
                .post('update', ({ admin, body: { data }, error }) => {
                    try {
                        admin.add(data);
                        return admin.get();
                    } catch (e) {
                        return error(406, e);
                    }
                },{
                    body: t.Object({
                        data: t.Object({
                            playerDuration: t.Number(),
                            eliminationAllianceCount: t.Number(),
                            matchGoals: t.Record(t.String(), MatchGoal)
                        })
                    })
                })
        )
    );