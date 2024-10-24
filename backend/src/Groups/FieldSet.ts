import {Elysia, error, t} from "elysia";
import {checkJWT} from "./Auth";
import {FieldSet} from "../runtime/FieldSet";

const MODULE_PERM = "admin"

export const fieldSetGroup = new Elysia()
    .decorate('fieldSet', new FieldSet())
    .group('/fieldset', (app) => app
        .get('', ({ fieldSet }) => fieldSet.get())
        .post('update', ({
            fieldSet, body: { data }, error
        }) => {
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
            }),
            async beforeHandle() {
                return await checkJWT(MODULE_PERM, error);
            }
        })
        .delete('delete/:fieldSetId', ({
            fieldSet, params: { fieldSetId }, error
        }) => {
            try {
                fieldSet.delete(fieldSetId);
                return fieldSet.get();
            } catch (e) {
                return error(406, e);
            }
        }, {
            params: t.Object({
                fieldSetId: t.Number()
            }),
            async beforeHandle() {
                return await checkJWT(MODULE_PERM, error);
            }
        })
    );
