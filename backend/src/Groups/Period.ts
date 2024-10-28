import {Elysia, error, t} from "elysia";
import {Period} from "../runtime/Period";
import {checkJWT} from "../runtime/Auth";

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
                .post('update', ({ period, body: { periodNumber, periodType, periodEndTime, periodStartTime, periodMatchDuration }, error }) => {
                    try {
                        period.add(periodNumber, periodType, periodStartTime, periodEndTime, periodMatchDuration);
                        return period.get();
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    body: t.Object({
                        periodNumber: t.Number(),
                        periodType: t.String(),
                        periodStartTime: t.String(),
                        periodEndTime: t.String(),
                        periodMatchDuration: t.Number()
                    })
                })
                .delete('delete/:divisionName/:periodId', ({ period, params: { divisionName, periodId }, error }) => {
                    try {
                        period.delete(decodeURI(divisionName), periodId);
                        return period.get();
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    params: t.Object({
                        divisionName: t.String(),
                        periodId: t.Number()
                    })
                })
        )
    );