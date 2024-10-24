import {Elysia, error, t} from "elysia";
import {checkJWT} from "./Auth";
import {Division} from "../runtime/Division";

const MODULE_PERM = "admin"

export const divisionGroup = new Elysia()
    .decorate('division', new Division())
    .group('/division', (app) => app
        .get('', ({ division }) => division.get())
        .post('update', ({
            division, body: { data }, error
        }) => {
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
            }),
            async beforeHandle() {
                return await checkJWT(MODULE_PERM, error);
            }
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
            }),
            async beforeHandle() {
                return await checkJWT(MODULE_PERM, error);
            }
        })
    );
