import {Elysia, t} from "elysia";
import {getMatchDuration, pauseTimer, repeatGetTime, startTimer, stopTimer} from "../runtime/Timer";
import {TimerAction} from "../../../common/Timer";

let MATCH_DURATION = getMatchDuration()

export const timerGroup = new Elysia()
    .group('/timer', (app) => app
        .ws('/match', {
            // validate incoming message
            body: t.Object({
                fieldName: t.String(),
                matchType: t.String(),
                matchNumber: t.Number(),
                action: t.Enum(TimerAction)
            }),
            message(ws, { fieldName, matchNumber, action }) {
                switch (action) {
                    case TimerAction.start:
                        startTimer(fieldName);
                        repeatGetTime(MATCH_DURATION, fieldName, (data) => {
                            ws.send(data);
                        });
                        break;
                    case TimerAction.stop:
                        stopTimer(fieldName);
                        break;
                    case TimerAction.pause:
                        pauseTimer(fieldName);
                        break;
                }
            },
            open(ws) {
                console.log('open');
            },
        })
    );
