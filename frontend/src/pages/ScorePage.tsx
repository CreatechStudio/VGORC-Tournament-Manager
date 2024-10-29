import {
    Box,
    Button,
    ButtonGroup, Grid,
    IconButton,
    Input,
    List,
    ListItem,
    Stack,
    Typography
} from "@mui/joy";
import {PAD} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";
import {useEffect, useState} from "react";
import {DivisionObject} from "../../../common/Division.ts";
import {getReq, logout, postReq} from "../net.ts";
import {MatchObject} from "../../../common/Match.ts";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import LogoutIcon from "@mui/icons-material/Logout";

const DIVISION_NAME_KEY = "division";
const MATCH_NUMBER_KEY = "match";

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
                                window.location.href = `${urlPrefix}?${divisionNameKey}=${d.divisionName}`;
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
                                window.location.href = `/score?${DIVISION_NAME_KEY}=${divisionName}&${MATCH_NUMBER_KEY}=${m.matchNumber}`;
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
    divisionName
} : {
    matchNumber: string;
    divisionName: string;
}) {
    const [matches, setMatches] = useState<MatchObject[]>([]);
    const [current, setCurrent] = useState<MatchObject | null>(null);

    useEffect(() => {
        getReq(`/match/${divisionName}/${matchNumber}`).then((res) => {
            setCurrent(res);
        }).catch();
        getReq(`/match/${divisionName}`).then((res) => {
            setMatches(res);
        }).catch();
    }, []);

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
        window.location.href = `/score?${DIVISION_NAME_KEY}=${divisionName}&${MATCH_NUMBER_KEY}=${newMatchNumber}`;
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

    return (
        <Stack sx={{height: '100%'}}>
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
                        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <Box sx={{
                                display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center",
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
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                <Button size="lg" fullWidth onClick={() => handleSave()}>
                    Save
                </Button>
            </Box>
        </Stack>
    );
}

export default function ScorePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const divisionName = urlParams.get(DIVISION_NAME_KEY);
    const matchNumber = urlParams.get(MATCH_NUMBER_KEY);

    function GetContent() {
        if (divisionName) {
            if (matchNumber) {
                return <SetScorePage
                    matchNumber={matchNumber}
                    divisionName={divisionName}
                />;
            } else {
                return <ChooseMatchPage
                    divisionName={divisionName}
                />;
            }
        } else {
            return <ChooseDivisionPage
                divisionNameKey={DIVISION_NAME_KEY}
                urlPrefix="/score"
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
                            Score
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
