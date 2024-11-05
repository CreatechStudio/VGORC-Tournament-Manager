import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Grid,
    IconButton,
    Input,
    List,
    ListItem,
    Stack,
    Typography
} from "@mui/joy";
import {generateSocketUrl, LARGE_PART, PAD, PAD2, SMALL_PART} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";
import {useEffect, useState} from "react";
import {DivisionObject} from "../../../common/Division.ts";
import {getReq, logout, postReq, toLocation} from "../net.ts";
import {MatchObject} from "../../../common/Match.ts";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import LogoutIcon from "@mui/icons-material/Logout";
import {Websocket, WebsocketBuilder, WebsocketEvent} from "websocket-ts";
import {TimerAction} from "../../../common/Timer.ts";

const DIVISION_NAME_KEY = "division";
const MATCH_NUMBER_KEY = "match";
const DISPLAY_MODE_KEY = "displayMode";
const FIELD_NAME_KEY = "fieldName";

export function ChooseDivisionPage({
    divisionNameKey,
    urlPrefix
} : {
    divisionNameKey: string;
    urlPrefix: string;
}) {
    const [divisions, setDivisions] = useState<DivisionObject[]>([]);

    useEffect(() => {
        getReq('/division').then((res) => {
            setDivisions(res);
        }).catch();
    }, []);

    return (
        <List sx={{gap: PAD, overflowY: 'auto'}}>
            {
                divisions.map((d, i) => (
                    <ListItem key={i} sx={{width: '100%'}}>
                        <Button
                            sx={{width: '100%'}}
                            variant="soft"
                            size="lg"
                            onClick={() => {
                                const params = {};
                                // @ts-ignore
                                params[divisionNameKey] = d.divisionName;
                                toLocation(urlPrefix, params);
                            }}
                        >
                            {d.divisionName}
                        </Button>
                    </ListItem>
                ))
            }
        </List>
    );
}

function ChooseMatchPage({
    divisionName
} : {
    divisionName: string
}) {
    const [matches, setMatches] = useState<MatchObject[]>([]);

    useEffect(() => {
        getReq(`/match/${divisionName}`).then((res) => {
            setMatches(res);
        }).catch();
    }, []);

    return (
        <List sx={{overflowY: 'scroll'}}>
            {
                matches.map((m, i) => (
                    <ListItem key={i} sx={{width: '100%'}}>
                        <Button
                            sx={{width: '100%'}}
                            variant="soft"
                            size="lg"
                            onClick={() => {
                                const params = {};
                                // @ts-ignore
                                params[DIVISION_NAME_KEY] = divisionName;
                                // @ts-ignore
                                params[MATCH_NUMBER_KEY] = m.matchNumber;
                                toLocation('score', params);
                            }}
                        >
                            {m.matchType} {m.matchNumber}
                        </Button>
                    </ListItem>
                ))
            }
        </List>
    );
}

function SetScorePage({
    matchNumber,
    divisionName,
    displayMode,
    fieldName
} : {
    matchNumber: string;
    divisionName: string;
    displayMode: boolean;
    fieldName: string | null;
}) {
    const [matches, setMatches] = useState<MatchObject[]>([]);
    const [current, setCurrent] = useState<MatchObject | null>(null);
    const [totalTime, setTotalTime] = useState<number | null>(null);
    const [time, setTime] = useState<number | null>(null);
    const [timerWs, setTimerWs] = useState<Websocket | null>(null);

    useEffect(() => {
        if (displayMode && fieldName) {
            const ws = connectTimer(fieldName);
            setTimerWs(ws);
        } else {
            getReq(`/match/${divisionName}/${matchNumber}`).then((res) => {
                setCurrent(res);
            }).catch();
            getReq(`/match/${divisionName}`).then((res) => {
                setMatches(res);
            }).catch();
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

    function _indexOf(match: MatchObject | null) {
        if (match === null) {
            return -1;
        }
        for (let i = 0; i < matches.length; i ++) {
            if (match.matchNumber === matches[i].matchNumber) {
                return i;
            }
        }
        return -1;
    }

    function toMatch(newMatchNumber: string | number) {
        const params = {};
        // @ts-ignore
        params[DIVISION_NAME_KEY] = divisionName;
        // @ts-ignore
        params[MATCH_NUMBER_KEY] = newMatchNumber;
        toLocation('score', params);
    }

    function handleLast() {
        const index = _indexOf(current) - 1;
        if (index >= 0 && index < matches.length) {
            toMatch(matches[index].matchNumber);
        }
    }

    function handleNext() {
        const index = _indexOf(current) + 1;
        if (index >= 0 && index < matches.length) {
            toMatch(matches[index].matchNumber);
        }
    }

    function handleChooseMatch() {
        toMatch("");
    }

    function setScore(score: number) {
        const newCurrent: MatchObject = JSON.parse(JSON.stringify(current));
        newCurrent.matchScore = Math.max(score, 0);
        setCurrent(newCurrent);
    }

    function handleChangeInput(newInput: string) {
        const inp = newInput.trim();
        if (inp === "0") {
            setScore(0);
        } else {
            const newScore = parseInt(inp) || current?.matchScore || 0;
            setScore(newScore);
        }
    }

    function handleSave() {
        postReq('/match/update', {
            divisionName: divisionName,
            matchNumber: parseInt(matchNumber),
            score: current?.matchScore || 0
        }).then((res) => {
            setCurrent(res);
        }).catch();
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
        <Stack sx={{height: '100%'}}>
            {
                displayMode ? <></> : (
                    <Box sx={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <Typography level="h2">
                            Score - {current?.matchType} {current?.matchNumber}
                        </Typography>
                        <ButtonGroup size="lg">
                            <IconButton onClick={() => handleLast()}>
                                <ChevronLeftIcon/>
                            </IconButton>
                            <IconButton onClick={() => handleNext()}>
                                <ChevronRightIcon/>
                            </IconButton>
                            <IconButton onClick={() => handleChooseMatch()}>
                                <ListAltOutlinedIcon/>
                            </IconButton>
                            <MenuDrawer/>
                            <IconButton onClick={() => logout()}>
                                <LogoutIcon/>
                            </IconButton>
                        </ButtonGroup>
                    </Box>
                )
            }
            <Box sx={{height: '100%', width: '100%'}}>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{position: 'absolute'}}
                    style={{minHeight: '100vh', left: 0, top: 0, width: '100vw'}}
                >
                    <Grid xs={10}>
                        <Box sx={{
                            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                            gap: `${PAD2}rem`, height: '100%'
                        }}>
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
                            {
                                displayMode ? <></> : (
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        width: '100%'
                                    }}>
                                        <IconButton variant="outlined" size="lg" onClick={() => {
                                            if (current) {
                                                setScore(current.matchScore - 1);
                                            }
                                        }}>
                                            <RemoveIcon/>
                                        </IconButton>
                                        <Input
                                            value={current?.matchScore}
                                            size="lg"
                                            sx={{textAlign: 'center'}}
                                            onChange={(e) => handleChangeInput(e.target.value)}
                                        />
                                        <IconButton variant="outlined" size="lg" onClick={() => {
                                            if (current) {
                                                setScore(current.matchScore + 1);
                                            }
                                        }}>
                                            <AddIcon/>
                                        </IconButton>
                                    </Box>
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                {
                    displayMode ? <></> : (
                        <Button size="lg" fullWidth onClick={() => handleSave()}>
                            Save
                        </Button>
                    )
                }
            </Box>
        </Stack>
    );
}

export default function ScorePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const divisionName = urlParams.get(DIVISION_NAME_KEY);
    const matchNumber = urlParams.get(MATCH_NUMBER_KEY);
    const displayMode = urlParams.get(DISPLAY_MODE_KEY) !== null;
    const fieldName = urlParams.get(FIELD_NAME_KEY);

    const directDisplay = displayMode && fieldName !== null;

    function GetContent() {
        if (divisionName || directDisplay) {
            if (matchNumber || directDisplay) {
                return <SetScorePage
                    matchNumber={matchNumber || ""}
                    divisionName={divisionName || ""}
                    displayMode={displayMode}
                    fieldName={fieldName}
                />;
            } else {
                return <ChooseMatchPage
                    divisionName={divisionName || ""}
                />;
            }
        } else {
            return <ChooseDivisionPage
                divisionNameKey={DIVISION_NAME_KEY}
                urlPrefix="#score"
            />;
        }
    }

    return (
        <Box sx={{height: '90vh', display: 'flex', flexDirection: 'column', gap: PAD, overflow: 'hidden', width: '100%'}}>
            {
                divisionName && matchNumber ? <></> :
                    <Box sx={{
                        pl: PAD, pr: PAD, pb: PAD,
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <Typography level="title-lg">
                            Match
                        </Typography>
                        <ButtonGroup>
                            <MenuDrawer/>
                        </ButtonGroup>
                    </Box>
            }
            <GetContent/>
        </Box>
    );
}
