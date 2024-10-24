import {Elysia, error, t} from "elysia";
import {checkJWT} from "./Auth";
import {Match} from "../runtime/Match";

const MODULE_PERM = 'match';

export const matchGroup = new Elysia()
    .decorate('match', new Match())
    .group('/match', (app) => app
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
            }
        )
        .post('update', ({ match, body }) =>
            match.setScore(body.divisionName, body.matchNumber, body.score), {
            body: t.Object({
                divisionName: t.String(),
                matchNumber: t.Number(),
                score: t.Number()
            }),
            async beforeHandle() {
                return await checkJWT(MODULE_PERM, error);
            }
            }
        )
    );