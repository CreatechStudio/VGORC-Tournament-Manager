import { useEffect, useRef, useState } from "react";
import { Websocket, WebsocketBuilder, WebsocketEvent } from "websocket-ts";
import { TimerAction } from "../../../common/Timer.ts";
import toast from "react-hot-toast";
import {Box, Button, CircularProgress} from "@mui/joy";
import {generateSocketUrl, LARGE_PART, PAD, PAD2, SMALL_PART} from "../constants.ts";
import {PingPongTest} from "../net.ts";

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
    const [localTime, setLocalTime] = useState<number>(0);
    const [useLocal, setUseLocal] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const localTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        PingPongTest(undefined, () => {
            toast.error("Switch to local countdown!", {id: "switch-to-local"});
            setUseLocal(true);
            setIsActive(true);
            timerWs?.close();
            setTimerWs(null);
            setIsConnected(false);
        });

        if (displayMode && fieldName) {
            retryConnectTimer(fieldName);
        }
    }, []);

    useEffect(() => {
        if (isActive && localTime > 0) {
            localTimerRef.current = setTimeout(() => {
                setLocalTime(localTime - 1);
            }, 1000);
        } else if (localTime === 0) {
            setIsActive(false);
            if (displayMode && fieldName) {
                retryConnectTimer(fieldName);
            }
        }
        return () => {
            if (localTimerRef.current) {
                clearTimeout(localTimerRef.current);
            }
        };
    }, [isActive, localTime]);

    function retryConnectTimer(matchField: string) {
        if (isConnected) {
            return;
        }
        const ws = connectTimer(matchField);
        ws.addEventListener(WebsocketEvent.close, () => {
            setTimeout(() => {
                retryConnectTimer(matchField);
            }, 1000);
        });
        setTimerWs(ws);
    }

    function connectTimer(matchField: string, start?: boolean) {
        const ws = new WebsocketBuilder(generateSocketUrl('/timer/match')).build();
        ws.addEventListener(WebsocketEvent.message, (_instance, ev) => {
            const data = JSON.parse(ev.data);
            if (data.time !== undefined) {
                if (data.isTotal && !useLocal) {
                    setUseLocal(false);
                    setIsActive(true);
                    setLocalTime(data.time);
                    setTotalTime(data.time);
                } else {
                    setUseLocal(false);
                    setIsActive(true);
                    setLocalTime(data.time);
                    setTime(data.time);
                }
                if (data.time <= 0) {
                    stopTimer();
                }
            }
        });
        ws.addEventListener(WebsocketEvent.close, (_instance) => {
            toast.error("Connection closed", {id: "wsclosed"});
            setUseLocal(true);
            setIsConnected(false);
        });
        ws.addEventListener(WebsocketEvent.error, (_instance) => {
            toast.error("Connection lost", {id: "wslost"});
            setUseLocal(true);
            setIsConnected(false);
        });
        ws.addEventListener(WebsocketEvent.reconnect, (_instance) => {
            toast.success("Reconnect");
            setUseLocal(false);
            setIsConnected(true);
        });
        ws.addEventListener(WebsocketEvent.open, (instance) => {
            if (matchField) {
                toast.success("Websocket Connected Successfully", {id: "wsconnect"});
                setIsConnected(true);
                instance.send(JSON.stringify({
                    fieldName: matchField,
                    action: TimerAction.start,
                    holding: !start
                }));
            } else {
                toast.error("No field name provided", {id: "no-timer-field"});
            }
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
        setUseLocal(false);
        setIsActive(false);
        setTime(0);
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
        const t = useLocal ? localTime : time
        if (t !== null && t >= 0) {
            const seconds = t % 60;
            const minutes = (t - seconds) / 60;
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
                value={(useLocal ? localTime : time || 0) / (totalTime || 0) * 100}
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