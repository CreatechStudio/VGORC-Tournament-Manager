import {Elysia, t} from "elysia";
import {Ranking} from "../Runtime/Ranking";

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
        .get('/elimination/:divisionName', ({ rank, params }) =>
            rank.getElimRanking(params.divisionName), {
            params: t.Object({
                divisionName: t.String()
            })
        })
    );