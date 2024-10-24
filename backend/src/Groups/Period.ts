import {Elysia, error, t} from "elysia";
import {checkJWT} from "./Auth";
import {Period} from "../runtime/Period";

const MODULE_PERM = "admin"

export const periodGroup = new Elysia()
    .decorate('period', new Period())
    .group('/period', (app) => app
        .get('', ({ period }) => period.get())
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
            }),
            async beforeHandle() {
                return await checkJWT(MODULE_PERM, error);
            }
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
            }),
            async beforeHandle() {
                return await checkJWT(MODULE_PERM, error);
            }
        })
    );