import {Elysia, error, t} from "elysia";
import {checkJWT} from "../runtime/Auth";
import {Schedule} from "../runtime/Schedule";

const MODULE_PERMISSION = "admin"

export const scheduleGroup = new Elysia()
    .decorate('schedule', new Schedule())
    .group('/schedule', (app) => app
        .get('qualification', ({ schedule }) => schedule.getQualification())
        .get('elimination', ({ schedule }) => schedule.getElimination())
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, error)
                }
            },(app) => app
                .get('add/:matchType', ({ schedule, params, error }) => {
                    try {
                        if (params.matchType === 'Qualification') {
                            schedule.addQualification();
                            return schedule.getQualification();
                        } else if (params.matchType === 'Elimination') {
                            schedule.addElimination();
                            return schedule.getElimination();
                        }
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    params: t.Object(
                        {
                            matchType: t.String()
                        }
                    )
                })
                .get('clear', ({ schedule, error }) => {
                    try {
                        schedule.clearAllSchedule();
                        return schedule.getQualification();
                    } catch (e) {
                        return error(406, e);
                    }
                })
        )
    );