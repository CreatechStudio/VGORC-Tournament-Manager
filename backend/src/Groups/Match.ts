import { Elysia, t } from "elysia";
import { Match } from "../../../common/Match";

export const matchGroup = new Elysia()
    .decorate('match', new Match())
    .group('/match', (app) => app
        .get('', ({ match, body }) =>
                match.getScore(body.divisionName, body.matchNumber), {
                body: t.Object({
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
                })
            }
        )
    );