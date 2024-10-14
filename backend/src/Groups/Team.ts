import {Elysia, t} from "elysia";
import {Team} from "../../../common/team";

export const team = new Elysia()
    .decorate('team', new Team())
    .group('/team', (app) => app
        .get('', ({ team }) => team.get())
        .post('create', ({
            team, body: { data }, error
        }) => {
            try {
                team.add(data);
            } catch (e) {
                return error(406, e);
            }
        }, {
            body: t.Object({
                data: t.Object({
                    teamNumber: t.String(),
                    teamName: t.String(),
                    teamOrganization: t.String(),
                })
            })
        })
        .delete('delete/:data', ({
            team, params: { data }, error
        }) => {
            try {
                team.delete(data);
            } catch (e) {
                return error(406, e);
            }
        }, {
            params: t.Object({
                data: t.String()
            })
        })
    );