import {Elysia, status, t} from "elysia";
import {Match} from "../Runtime/Match";
import {checkJWT} from "../Runtime/Auth";

const MODULE_PERMISSION = "match"
const PUBLISH_SECRET = Bun.env.TM_PUBLISH_SECRET || "";

export const matchGroup = new Elysia()
    .decorate('match', new Match())
    .group('/match', (app) => app
        .get('/publish/:divisionName', ({ match, params, query, set }) => {
            if (query.secret !== PUBLISH_SECRET) {
                return status(401, "Unauthorized");
            }
            return match.getAllMatches(params.divisionName)
        },
        {
            params: t.Object({
                divisionName: t.String()
            }),
            query: t.Object({
                secret: t.String()
            })
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
                .post('update', ({ match, body }) => {
                        try {
                            match.setScore(body.divisionName, body.matchNumber, body.scoreDetails);
                        } catch (e) {
                            return status(406, e);
                        }
                    }, {
                        body: t.Object({
                            divisionName: t.String(),
                            matchNumber: t.Number(),
                            scoreDetails: t.Record(t.String(), t.Number()),
                        }),
                    })
        )
    );