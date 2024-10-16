import {Elysia, t} from "elysia";
import {Team} from "../../../common/Team";

export const teamGroup = new Elysia()
    .decorate('team', new Team())
    .group('/team', (app) => app
        .get('', ({ team }) => team.get())
        .post('update', ({
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
                    teamDivision: t.String(),
                    teamAvgScore: t.Integer()
                })
            })
        })
        .delete('delete/:teamNumber', ({
            team, params: { teamNumber }, error
        }) => {
            try {
                team.delete(teamNumber);
            } catch (e) {
                return error(406, e);
            }
        }, {
            params: t.Object({
                teamNumber: t.String()
            })
        })
    );
