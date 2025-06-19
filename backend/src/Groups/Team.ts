import {Elysia, status, t} from "elysia";
import {Team} from "../Runtime/Team";
import {checkJWT} from "../Runtime/Auth";

const MODULE_PERMISSION = "admin"

export const teamGroup = new Elysia()
    .decorate('team', new Team())
    .group('/team', (app) => app
        .get('', ({ team }) => team.get())
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return status(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, status)
                }
            },(app) => app
                .post('update', ({ team, body: { data }, status }) => {
                    try {
                        team.add(data);
                    } catch (e) {
                        return status(406, e);
                    }
                }, {
                    body: t.Object({
                        data: t.Object({
                            teamNumber: t.String(),
                            teamName: t.String(),
                            teamOrganization: t.String(),
                            teamDivision: t.String()
                        })
                    })
                })
                .delete('delete/:teamNumber', ({ team, params: { teamNumber }, status }) => {
                    try {
                        team.delete(teamNumber);
                    } catch (e) {
                        return status(406, e);
                    }
                }, {
                    params: t.Object({
                        teamNumber: t.String()
                    })
                })
        )
    );
