import {Elysia, error, t} from "elysia";
import {Division} from "../runtime/Division";
import {checkJWT} from "../runtime/Auth";

const MODULE_PERMISSION = "admin"

export const divisionGroup = new Elysia()
    .decorate('division', new Division())
    .group('/division', (app) => app
        .get('', ({ division }) => division.get())
        .guard(
            {
            async beforeHandle ({cookie: { permission }}) {
                if (typeof permission !== "string") {
                    return error(401, "Unauthorized");
                }
                return await checkJWT(permission, MODULE_PERMISSION, error)
            }
            },(app) => app
            .post('update', ({ division, body: { data }, error }) => {
                try {
                    division.add(data);
                    return division.get();
                } catch (e) {
                    return error(406, e);
                }
            }, {
                body: t.Object({
                    data: t.Object({
                        divisionName: t.String(),
                        divisionFields: t.Array(t.String())
                    })
                })
            })
            .delete('delete/:name', ({ division, params: { name }, error }) => {
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
        )
    );
