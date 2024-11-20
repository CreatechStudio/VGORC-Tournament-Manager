import {Elysia, error, t} from "elysia";
import {Display} from "../runtime/Display";
import {checkJWT} from "../runtime/Auth";

const MODULE_PERMISSION = "admin"

export const displayGroup = new Elysia()
    .decorate('display', new Display())
    .group('/display', (app) => app
        .get('', ({ display }) => display.get())
        .get(':displaySerial', ({ params: { displaySerial }, display }) => {
            display.new({ displaySerial, displayPath: "", displayEnabled: false });
            return display.getSerial(displaySerial);
        },{
            params: t.Object({
                displaySerial: t.String()
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
                .post('update', ({ display, body: { data }, error }) => {
                    try {
                        display.update(data);
                        return display.get();
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    body: t.Object({
                        data: t.Object({
                            displaySerial: t.String(),
                            displayPath: t.String(),
                            displayEnabled: t.Boolean()
                        })
                    })
                })
        )
    );