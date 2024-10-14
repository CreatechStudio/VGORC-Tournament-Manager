import {Elysia, t} from "elysia";
import {Division} from "../../../common/Division";

export const division = new Elysia()
    .decorate('division', new Division())
    .group('/division', (app) => app
        .get('', ({ division }) => division.get())
        .post('create', ({
            division, body: { name, fields }, error
        }) => {
            try {
                division.add(name, fields);
            } catch (e) {
                return error(406, e);
            }
        }, {
            body: t.Object({
                name: t.String(),
                fields: t.Array(t.String())
            })
        })
        .delete('delete/:data', ({
            division, params: { data }, error
        }) => {
            try {
                division.delete(data);
            } catch (e) {
                return error(406, e);
            }
        }, {
            params: t.Object({
                data: t.String()
            })
        })
    );
