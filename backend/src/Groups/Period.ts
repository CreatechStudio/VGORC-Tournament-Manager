import {Elysia, error, t} from "elysia";
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
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, error)
                }
            },(app) => app
                .post('update', ({ period, body: { data }, error }) => {
                    try {
                        period.add(data.periodNumber, data.periodType, data.periodStartTime, data.periodEndTime, data.periodMatchDuration);
                        return period.get();
                    } catch (e) {
                        return error(406, e);
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
                .delete('delete/:periodId', ({ period, params: { periodId }, error }) => {
                    try {
                        period.delete(periodId);
                        return period.get();
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    params: t.Object({
                        periodId: t.Number()
                    })
                })
        )
    );