import {Elysia} from "elysia";

export const staticGroup = new Elysia()
    .group('/public', (app) => app
        .get('CreatechStudio.png', ({ redirect }) => {
            return redirect('https://cdn.createchstudio.com/vgorc-tm/CreatechStudio.png')
        })
        .get('VEX GO Logo_Full Color.png', ({ redirect }) => {
            return redirect('https://cdn.createchstudio.com/vgorc-tm/VEX GO Logo_Full Color.png')
        })
    );