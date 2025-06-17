import {Elysia, error, t} from "elysia";
import {SkillType} from "../../../common/Skill";
import {Skill} from "../runtime/Skill";
import {checkJWT} from "../runtime/Auth";

const MODULE_PERMISSION = "match"

export const skillGroup = new Elysia()
    .decorate('skill', new Skill())
    .group('/skill', (app) => app
        .get('/:teamNumber', ({ skill, params }) =>
            skill.getSkill(params.teamNumber), {
            params: t.Object({
                teamNumber: t.String()
            })
        })
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, error)
                }
            },(app) => app
                .get('fields', ({ skill }) => skill.getAllSkillFields())
                .post('/update', ({ skill, body }) =>
                    skill.setSkillScore(body.teamNumber, body.skillType as SkillType, body.scoreDetails), {
                    body: t.Object({
                        teamNumber: t.String(),
                        skillType: t.String(),
                        scoreDetails: t.Record(t.String(), t.Number()),
                    })
                })
        )
    );