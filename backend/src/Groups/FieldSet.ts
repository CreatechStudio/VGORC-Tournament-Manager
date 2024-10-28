import {Elysia, error, t} from "elysia";
import {FieldSet} from "../runtime/FieldSet";
import {checkJWT} from "../runtime/Auth";

const MODULE_PERMISSION = "admin"

export const fieldSetGroup = new Elysia()
    .decorate('fieldSet', new FieldSet())
    .group('/fieldset', (app) => app
        .get('', ({ fieldSet }) => fieldSet.get())
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (typeof permission !== "string") {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission, MODULE_PERMISSION, error)
                }
            },(app) => app
                .post('update', ({ fieldSet, body: { data }, error }) => {
                    try {
                        fieldSet.add(data);
                        return fieldSet.get();
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    body: t.Object({
                        data: t.Object({
                            fieldSetId: t.Number(),
                            fields: t.Array(t.String())
                        })
                    })
                })
                .delete('delete/:fieldSetId', ({ fieldSet, params: { fieldSetId }, error }) => {
                    try {
                        fieldSet.delete(fieldSetId);
                        return fieldSet.get();
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    params: t.Object({
                        fieldSetId: t.Number()
                    })
                })
        )
    );
