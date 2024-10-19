import {Elysia, t} from "elysia";
import {Ranking} from "../../../common/Ranking";

export const rankingGroup = new Elysia()
    .decorate('rank', new Ranking())
    .group('/rank', (app) => app
        .get(':division', ({ rank, params }) =>
            rank.getRanking(params.division), {
            params: t.Object({
                division: t.String()
            })
        })
    );