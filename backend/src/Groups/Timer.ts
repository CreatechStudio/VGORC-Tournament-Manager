import {Elysia, t} from "elysia";
import {getMatchDuration, pauseTimer, repeatGetTime, startTimer, stopTimer} from "../Runtime/Timer";
import {TimerAction} from "../../../common/Timer";

export const timerGroup = new Elysia()
    .group('/timer', (app) => app
        .ws('/match', {
            // validate incoming message
            body: t.Object({
                fieldName: t.String(),
                action: t.Enum(TimerAction),
                holding: t.Boolean()
            }),
            message(ws, { fieldName, action, holding }) {
                switch (action) {
                    case TimerAction.start:
                        if (!holding) {
                            // 如果没有挂起，才需要创建计时器
                            startTimer(fieldName);
                        }
                        let MATCH_DURATION = getMatchDuration()
                        repeatGetTime(MATCH_DURATION, fieldName, (data) => {
                            ws.send(data);
                        }, holding);
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
                let MATCH_DURATION = getMatchDuration()
                ws.send({
                    time: MATCH_DURATION,
                    isTotal: true
                });
            },
        })
    );
