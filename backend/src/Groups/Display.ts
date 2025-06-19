import {Elysia, status, t} from "elysia";
import {Display} from "../Runtime/Display";
import {checkJWT} from "../Runtime/Auth";

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
                        return status(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", MODULE_PERMISSION, status)
                }
            },(app) => app
                .post('update', ({ display, body: { data }, status }) => {
                    try {
                        display.update(data);
                        return display.get();
                    } catch (e) {
                        return status(406, e);
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