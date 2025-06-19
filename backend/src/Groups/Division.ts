import {Elysia, status, t} from "elysia";
import {Division} from "../Runtime/Division";
import {checkJWT} from "../Runtime/Auth";

const MODULE_PERMISSION = "admin"

export const divisionGroup = new Elysia()
    .decorate('division', new Division())
    .group('/division', (app) => app
        .get('all', ({ division }) => division.get())
        .get('match', ({ division }) => division.getMatch())
        .guard(
            {
            async beforeHandle ({cookie: { permission }}) {
                if (permission === undefined) {
                    return status(401, "Unauthorized");
                }
                return await checkJWT(permission.value || "", MODULE_PERMISSION, status)
            }
            },(app) => app
            .post('update', ({ division, body: { data }, status }) => {
                try {
                    division.add(data);
                    return division.get();
                } catch (e) {
                    return status(406, e);
                }
            }, {
                body: t.Object({
                    data: t.Object({
                        divisionName: t.String(),
                        isSkill: t.Boolean(),
                        divisionFields: t.Array(t.String())
                    })
                })
            })
            .delete('delete/:name', ({ division, params: { name }, status }) => {
                try {
                    division.delete(decodeURI(name));
                    return division.get();
                } catch (e) {
                    return status(406, e);
                }
            }, {
                params: t.Object({
                    name: t.String()
                })
            })
        )
    );
