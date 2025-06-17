import {Elysia, error, t} from "elysia";
import {Match} from "../Runtime/Match";
import {checkJWT} from "../Runtime/Auth";

const MODULE_PERMISSION = "match"

export const matchGroup = new Elysia()
    .decorate('match', new Match())
    .group('/match', (app) => app
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, error)
                }
            },(app) => app
                .get('/:divisionName', ({ match, params }) =>
                    match.getAllMatches(params.divisionName),{
                    params: t.Object({
                        divisionName: t.String()
                    })
                })
                .get('/:divisionName/:matchNumber', ({ match, params }) =>
                    match.getMatch(params.divisionName, params.matchNumber),{
                    params: t.Object({
                        divisionName: t.String(),
                        matchNumber: t.Number()
                    })
                })
                .post('update', ({ match, body }) =>
                    match.setScore(body.divisionName, body.matchNumber, body.scoreDetails), {
                    body: t.Object({
                        divisionName: t.String(),
                        matchNumber: t.Number(),
                        scoreDetails: t.Record(t.String(), t.Number()),
                    })
                })
        )
    );