import {Elysia, t} from "elysia";
import {Ranking} from "../runtime/Ranking";

export const rankingGroup = new Elysia()
    .decorate('rank', new Ranking())
    .group('/rank', (app) => app
        .get('/qualification/:divisionName', ({ rank, params }) =>
            rank.getQualRanking(params.divisionName), {
            params: t.Object({
                divisionName: t.String()
            })
        })
        .get('/skill', ({ rank }) =>
            rank.getSkillRanking()
        )
    );