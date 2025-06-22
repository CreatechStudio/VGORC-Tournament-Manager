import {Elysia, status, t} from "elysia";
import {SkillType} from "../../../common/Skill";
import {Skill} from "../Runtime/Skill";
import {checkJWT} from "../Runtime/Auth";

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
                        return status(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, status)
                }
            },(app) => app
                .get('fields', ({ skill }) => skill.getAllSkillFields())
                .post(
                    '/update',
                    ({ skill, body, status }) => {
                        try {
                            skill.setSkillScore(body.teamNumber, body.skillType as SkillType, body.scoreDetails);
                        } catch (e) {
                            return status(406, e);
                        }
                    }, {
                        body: t.Object({
                            teamNumber: t.String(),
                            skillType: t.String(),
                            scoreDetails: t.Array(t.Record(t.String(), t.Number())),
                        }),
                    }
                )
        )
    );