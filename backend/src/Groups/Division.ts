import {Elysia, t} from "elysia";
import {Division} from "../../../common/Division";

export const division = new Elysia()
    .decorate('division', new Division())
    .group('/division', (app) => app
        .get('', ({ division }) => division.get())
        .post('update', ({
            division, body: { name, fields }, error
        }) => {
            try {
                division.add(name, fields);
                return division.get();
            } catch (e) {
                return error(406, e);
            }
        }, {
            body: t.Object({
                name: t.String(),
                fields: t.Array(t.String())
            })
        })
        .delete('delete/:name', ({
            division, params: { name }, error
        }) => {
            try {
                division.delete(decodeURI(name));
                return division.get();
            } catch (e) {
                return error(406, e);
            }
        }, {
            params: t.Object({
                name: t.String()
            })
        })
    );
