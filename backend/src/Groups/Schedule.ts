import {Elysia, status, t} from "elysia";
import {checkJWT} from "../Runtime/Auth";
import {Schedule} from "../Runtime/Schedule";

const MODULE_PERMISSION = "admin"

export const scheduleGroup = new Elysia()
    .decorate('schedule', new Schedule())
    .group('/schedule', (app) => app
        .get(':divisionName', ({ schedule, params }) =>
        {
            return schedule.get(params.divisionName)
        }, {
            params: t.Object(
                {
                    divisionName: t.String()
                }
            )
        })
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return status(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, status)
                }
            },(app) => app
                .get('add/:matchType', ({ schedule, params, status }) => {
                    try {
                        if (params.matchType === 'Qualification') {
                            schedule.addQualification();
                            return schedule.get();
                        } else if (params.matchType === 'Elimination') {
                            schedule.addElimination();
                            return schedule.get();
                        } else if (params.matchType === 'Final') {
                            schedule.addFinal();
                            return schedule.get();
                        }
                    } catch (e) {
                        return status(406, e);
                    }
                }, {
                    params: t.Object(
                        {
                            matchType: t.String()
                        }
                    )
                })
                .get('clear/:matchType', ({ schedule, params, status }) => {
                    try {
                        schedule.clearSchedule(params.matchType);
                        return schedule.get();
                    } catch (e) {
                        return status(406, e);
                    }
                }, {
                    params: t.Object(
                        {
                            matchType: t.String()
                        }
                    )
                })
        )
    );