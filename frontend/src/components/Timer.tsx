import {Box, Button, CircularProgress} from "@mui/joy";
import {generateSocketUrl, LARGE_PART, PAD, PAD2, SMALL_PART} from "../constants.ts";
import {useEffect, useState} from "react";
import {Websocket, WebsocketBuilder, WebsocketEvent} from "websocket-ts";
import {TimerAction} from "../../../common/Timer.ts";

export default function Timer({
    displayMode,
    current,
    fieldName
} : {
    displayMode: boolean;
    current: any;
    fieldName: string | null;
}) {
    const [totalTime, setTotalTime] = useState<number | null>(null);
    const [time, setTime] = useState<number | null>(null);
    const [timerWs, setTimerWs] = useState<Websocket | null>(null);

    useEffect(() => {
        if (displayMode && fieldName) {
            const ws = connectTimer(fieldName);
            setTimerWs(ws);
        }
    }, []);

    function connectTimer(matchField: string, start?: boolean) {
        const ws = new WebsocketBuilder(generateSocketUrl('/timer/match')).build();
        ws.addEventListener(WebsocketEvent.message, (_instance, ev) => {
            const data = JSON.parse(ev.data);
            if (data.time !== undefined) {
                if (data.isTotal) {
                    setTotalTime(data.time);
                } else {
                    setTime(data.time);
                }
                if (data.time <= 0) {
                    stopTimer();
                }
            }
        });
        ws.addEventListener(WebsocketEvent.close, (_instance) => {
            // toast.error("Lost connection");
            setTime(0);
        });
        ws.addEventListener(WebsocketEvent.open, (instance) => {
            // toast.success("Websocket Connected Successfully");
            instance.send(JSON.stringify({
                fieldName: matchField,
                action: TimerAction.start,
                holding: !start
            }));
        });
        return ws;
    }

    function handleStartTimer() {
        if (current) {
            stopTimer();
            setTimerWs(connectTimer(fieldName || current.matchField, true));
        } else {
            return null;
        }
    }

    function stopTimer(ws?: Websocket) {
        const instance = ws || timerWs;
        if (instance && current) {
            instance.send(JSON.stringify({
                fieldName: fieldName || current.matchField,
                action: TimerAction.stop,
                holding: false
            }));
            setTime(0);
        }
    }

    function handleStopTimer() {
        if (confirm("Confirm to stop the timer.")) {
            stopTimer();
        }
    }

    function getTimeString() {
        if (time !== null) {
            const seconds = time % 60;
            const minutes = (time - seconds) / 60;
            let secondPrefix = "";
            if (seconds < 10) {
                secondPrefix = "0";
            }
            return `${minutes}:${secondPrefix}${seconds}`;
        } else {
            return "0:00";
        }
    }

    return (
        <Box sx={{
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            gap: PAD2
        }}>
            <CircularProgress
                value={(time || 0) / (totalTime || 0) * 100}
                determinate
                sx={{
                    "--CircularProgress-size": `${displayMode ? LARGE_PART : SMALL_PART}vh`,
                    "--CircularProgress-progressThickness": `${PAD}rem`,
                    "--CircularProgress-trackThickness": `${PAD}rem`
                }}
            >
                {getTimeString()}
            </CircularProgress>
            {
                displayMode ? <></> : (
                    <Box sx={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                        gap: PAD2, width: `${LARGE_PART}%`
                    }}>
                        <Button
                            variant="soft"
                            color="danger"
                            sx={{width: '100%'}}
                            onClick={() => handleStopTimer()}
                        >
                            Stop
                        </Button>
                        <Button
                            onClick={() => handleStartTimer()}
                            variant="soft"
                            sx={{width: '100%'}}
                        >
                            Start
                        </Button>
                    </Box>
                )
            }
        </Box>
    );
}