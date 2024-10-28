import {Elysia, error, t} from "elysia";
import {Team} from "../runtime/Team";
import {checkJWT} from "../runtime/Auth";

const MODULE_PERMISSION = "admin"

export const teamGroup = new Elysia()
    .decorate('team', new Team())
    .group('/team', (app) => app
        .get('', ({ team }) => team.get())
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, error)
                }
            },(app) => app
                .post('update', ({ team, body: { data }, error }) => {
                    try {
                        team.add(data);
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    body: t.Object({
                        data: t.Object({
                            teamNumber: t.String(),
                            teamName: t.String(),
                            teamOrganization: t.String(),
                            teamDivision: t.String(),
                            teamAvgScore: t.Integer()
                        })
                    })
                })
                .delete('delete/:teamNumber', ({ team, params: { teamNumber }, error }) => {
                    try {
                        team.delete(teamNumber);
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    params: t.Object({
                        teamNumber: t.String()
                    })
                })
        )
    );
