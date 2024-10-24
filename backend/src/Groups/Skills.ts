import {Elysia, t} from "elysia";
import {Skill, SkillType} from "../../../common/Skill";

export const skillGroup = new Elysia()
    .decorate('skill', new Skill())
    .group('/skill', (app) => app
        .get('/:teamNumber', ({ skill, params }) =>
            skill.getSkill(params.teamNumber), {
            params: t.Object({
                teamNumber: t.String()
            })
        })
        .post('/update', ({ skill, body }) =>
            skill.setSkillScore(body.teamNumber, body.skillType as SkillType, body.score), {
            body: t.Object({
                teamNumber: t.String(),
                skillType: t.String(),
                score: t.Number()
            })
        })
    );