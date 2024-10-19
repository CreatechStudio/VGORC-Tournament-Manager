import {Elysia, t} from "elysia";
import {Ranking} from "../../../common/Ranking";

export const rankingGroup = new Elysia()
    .decorate('rank', new Ranking())
    .group('/rank', (app) => app
        .get('/qualification/:divisionName', ({ rank, params }) =>
            rank.getQualRanking(params.division), {
            params: t.Object({
                division: t.String()
            })
        })
        .get('/skill', ({ rank }) =>
            rank.getSkillRanking()
        )
    );