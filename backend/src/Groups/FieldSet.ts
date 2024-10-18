import {Elysia, t} from "elysia";
import {FieldSet} from "../../../common/FieldSet";

export const fieldSetGroup = new Elysia()
    .decorate('fieldSet', new FieldSet())
    .group('/fieldset', (app) => app
        .get('', ({ fieldSet }) => fieldSet.get())
        .post('update', ({
            fieldSet, body: { data }, error
        }) => {
            try {
                fieldSet.add(data);
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
        .delete('delete/:fieldSetId', ({
            fieldSet, params: { fieldSetId }, error
        }) => {
            try {
                fieldSet.delete(fieldSetId);
            } catch (e) {
                return error(406, e);
            }
        }, {
            params: t.Object({
                fieldSetId: t.Number()
            })
        })
    );
