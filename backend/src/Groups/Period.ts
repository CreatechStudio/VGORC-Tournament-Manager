import {Elysia, status, t} from "elysia";
import {Period} from "../Runtime/Period";
import {checkJWT} from "../Runtime/Auth";

const MODULE_PERMISSION = "admin"

export const periodGroup = new Elysia()
    .decorate('period', new Period())
    .group('/period', (app) => app
        .get('', ({ period }) => period.get())
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return status(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, status)
                }
            },(app) => app
                .post('update', ({ period, body: { data }, status }) => {
                    try {
                        period.add(data.periodNumber, data.periodType, data.periodStartTime, data.periodEndTime, data.periodMatchDuration);
                        return period.get();
                    } catch (e) {
                        return status(406, e);
                    }
                }, {
                    body: t.Object(
                        {
                            data: t.Object({
                                periodNumber: t.Number(),
                                periodType: t.String(),
                                periodStartTime: t.String(),
                                periodEndTime: t.String(),
                                periodMatchDuration: t.Number()
                            })
                        }
                    )
                })
                .delete('delete/:periodId', ({ period, params: { periodId }, status }) => {
                    try {
                        period.delete(periodId);
                        return period.get();
                    } catch (e) {
                        return status(406, e);
                    }
                }, {
                    params: t.Object({
                        periodId: t.Number()
                    })
                })
        )
    );