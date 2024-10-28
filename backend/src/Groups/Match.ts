import {Elysia, error, t} from "elysia";
import {Match} from "../runtime/Match";
import {checkJWT} from "../runtime/Auth";

const MODULE_PERMISSION = "match"

export const matchGroup = new Elysia()
    .decorate('match', new Match())
    .group('/match', (app) => app
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (typeof permission !== "string") {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission, MODULE_PERMISSION, error)
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
                    match.setScore(body.divisionName, body.matchNumber, body.score), {
                    body: t.Object({
                        divisionName: t.String(),
                        matchNumber: t.Number(),
                        score: t.Number()
                    })
                })
        )
    );