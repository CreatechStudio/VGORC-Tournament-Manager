import {
    Box,
    Button,
    ButtonGroup, Divider,
    Grid,
    IconButton,
    Input,
    List,
    ListItem, Option, Select,
    Stack,
    Typography
} from "@mui/joy";
import {DIVISION_NAME_KEY, PAD, PAD2} from "../constants.ts";
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
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Timer from "../components/Timer.tsx";
import toast from "react-hot-toast";
import {useHistoryModal} from "../components/HistoryModal.tsx";
import {AdminObject} from "../../../common/Admin.ts";
import {
    matchGoals2Array,
    MatchGoalArrayItem,
    ScoreDetail,
    scoreDetails2Array,
    getNameFromMatchGoalId, getCountFromMatchGoalId, getPointsFromMatchGoalId, array2ScoreDetails
} from "../utils/MatchGoal.ts";
import NewGoalModal from "../components/NewGoalModal.tsx";
import useScoreDetailModal from "../components/ScoreDetailModal.tsx";

const MATCH_NUMBER_KEY = "matchNumber";
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
        document.title = "VGORC TM | Select Division";
        getReq('/division/match').then((res) => {
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
                                // @ts-expect-error params is an undefined object
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
        document.title = `VGORC TM | Select Match ${divisionName}`;
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
                                // @ts-expect-error params is an undefined object
                                params[DIVISION_NAME_KEY] = divisionName;
                                // @ts-expect-error params is an undefined object
                                params[MATCH_NUMBER_KEY] = m.matchNumber;
                                toLocation('score', params);
                            }}
                        >
                            {m.matchType} {m.matchNumber} {
                                m.hasScore ? "✅" : "❌"
                            }
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
    const [details, setDetails] = useState<ScoreDetail[]>([]);
    const [matchGoals, setMatchGoals] = useState<MatchGoalArrayItem[]>([]);
    const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);
    const [current, setCurrent] = useState<MatchObject | null>(null);
    const [setHistoryModalOpen, setHistory, HistoryModal] = useHistoryModal();
    const [setSDModalOpen, setSDModalDetails, setSDModalGoals, setSDModalTotal, SDModal] = useScoreDetailModal();
    const [openNewGoalModal, setOpenNewGoalModal] = useState(false);

    useEffect(() => {
        if (!(displayMode && fieldName)) {
            getReq(`/match/${divisionName}/${matchNumber}`).then((res) => {
                if (res) {
                    document.title = `VGORC TM | Score ${divisionName} - ${res?.matchType[0]}${matchNumber}`;
                    setCurrent(res);
                }
            }).catch();
            getReq(`/match/${divisionName}`).then((res) => {
                if (res) {
                    setMatches(res);
                }
            }).catch();
            getReq('/admin').then((res: AdminObject) => {
                if (res) {
                    setMatchGoals(matchGoals2Array(res.matchGoals));
                }
            }).catch();
        }
    }, []);

    useEffect(() => {
        if (current) {
            const details = scoreDetails2Array(current.scoreDetails);
            if (details.length > 0) {
                setCurrentGoalId(details[0].goalId);
            }
            setDetails(scoreDetails2Array(current.scoreDetails));
        }
    }, [current]);

    useEffect(() => {
        setSDModalGoals(matchGoals);
    }, [matchGoals]);

    useEffect(() => {
        setSDModalDetails(details);
        setSDModalTotal(getTotal());
    }, [details]);

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
        // @ts-expect-error params is an undefined object
        params[DIVISION_NAME_KEY] = divisionName;
        // @ts-expect-error params is an undefined object
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

    function setCount(count: number) {
        const index = details.findIndex((detail => detail.goalId === currentGoalId));
        if (index !== -1) {
            const newDetails = [...details];
            newDetails[index].count = count;
            setDetails(newDetails);
        }
    }

    function getTotal() {
        let total = 0;
        details.forEach((detail) => {
            total += detail.count * getPointsFromMatchGoalId(matchGoals, detail.goalId);
        });
        return total;
    }

    function handleChangeInput(newInput: string) {
        const inp = newInput.trim();
        if (inp === "0") {
            setCount(0);
        } else {
            const newCount = parseInt(inp) ?? getCountFromMatchGoalId(details, currentGoalId ?? "") ?? 0;
            setCount(newCount);
        }
    }

    function handleSave() {
        let success = true;
        if (current) {
            current.matchScore = getTotal();
            current.scoreDetails = array2ScoreDetails(details);
        }
        if (current?.hasScore) {
            success = confirm("Make sure you want to save the edited score.");
        }
        if (success) {
            if (current) {
                postReq('/match/update', {
                    divisionName: divisionName,
                    matchNumber: parseInt(matchNumber),
                    scoreDetails: current.scoreDetails
                }).then(() => {
                    toast.success("Save successfully");
                }).catch();
            }
        } else {
            toast("Cancelled");
        }
    }

    async function handleViewHistory() {
        const res = await getReq(`/match/${divisionName}/${matchNumber}`);
        const history: number[] = JSON.parse(JSON.stringify(res?.matchScoreHistory || [0]));
        history.pop();
        setHistory(history);
        setHistoryModalOpen(true);
    }

    return (
        <Stack sx={{height: '100%'}}>
            {
                displayMode ? <></> : (
                    <Box sx={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <Typography level="h2">
                            Score - {current?.matchType} {current?.matchNumber} {current?.hasScore ? " ✅" : " ❌"}
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
                            <MenuDrawer sendParam={`${FIELD_NAME_KEY}=${fieldName || current?.matchField}`}/>
                            <IconButton onClick={() => logout()}>
                                <LogoutIcon/>
                            </IconButton>
                        </ButtonGroup>
                    </Box>
                )
            }
            <Typography level="h3">
                {displayMode ? "" : `${current?.matchField} - ${current?.matchTeam.join(' & ')}`}
            </Typography>
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
                            <Timer
                                displayMode={displayMode}
                                current={current}
                                fieldName={fieldName}
                            />
                            {
                                displayMode ? <></> : (
                                    <Stack width="100%" justifyContent="center" alignItems="center" gap={PAD2}>
                                        <Stack
                                            direction="row" width="100%"
                                            justifyContent="space-around" alignItems="center"
                                        >
                                            <Select
                                                onChange={(_e, value) => setCurrentGoalId(value)}
                                                value={currentGoalId}
                                            >
                                                {
                                                    details.map((detail, index) => (
                                                        <Option value={detail.goalId} key={index}>
                                                            {getNameFromMatchGoalId(matchGoals, detail.goalId)} ({getPointsFromMatchGoalId(matchGoals, detail.goalId)})
                                                        </Option>
                                                    ))
                                                }
                                            </Select>
                                            <IconButton variant="outlined" size="lg" onClick={() => {
                                                setCount(getCountFromMatchGoalId(details, currentGoalId ?? "") - 1);
                                            }}>
                                                <RemoveIcon/>
                                            </IconButton>
                                            <Input
                                                value={getCountFromMatchGoalId(details, currentGoalId ?? "")}
                                                size="lg"
                                                sx={{textAlign: 'center'}}
                                                onChange={(e) => handleChangeInput(e.target.value)}
                                            />
                                            <IconButton variant="outlined" size="lg" onClick={() => {
                                                if (current) {
                                                    setCount(getCountFromMatchGoalId(details, currentGoalId ?? "") + 1);
                                                }
                                            }}>
                                                <AddIcon/>
                                            </IconButton>
                                            <IconButton variant="outlined" size="lg" onClick={() => {
                                                if (current && currentGoalId) {
                                                    const newDetails = details.filter(detail => detail.goalId !== currentGoalId);
                                                    setDetails(newDetails);
                                                    // 选中下一个goal（如果有），否则设为null
                                                    if (newDetails.length > 0) {
                                                        setCurrentGoalId(newDetails[0].goalId);
                                                    } else {
                                                        setCurrentGoalId(null);
                                                    }
                                                }
                                            }}>
                                                <DeleteOutlineOutlinedIcon/>
                                            </IconButton>
                                        </Stack>
                                        <Divider/>
                                        <Stack
                                            direction="row" width="100%"
                                            justifyContent="space-around" alignItems="center"
                                        >
                                            <Button
                                                startDecorator={<AddIcon/>}
                                                variant="outlined"
                                                onClick={() => setOpenNewGoalModal(true)}
                                            >
                                                New Goal
                                            </Button>
                                            <Stack justifyContent="center" alignItems="center">
                                                <Typography level="title-lg">
                                                    Total: {getTotal()}
                                                </Typography>
                                                <Typography
                                                    onClick={() => setSDModalOpen(true)}
                                                    sx={{cursor: "pointer", textDecoration: "underline"}}
                                                    color="primary"
                                                >
                                                    View Details
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                {
                    displayMode ? <></> : (
                        <Box sx={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
                            width: '100%', gap: PAD2
                        }}>
                            <Button size="lg" fullWidth variant="outlined" onClick={() => handleViewHistory()}>
                                View History
                            </Button>
                            <Button size="lg" fullWidth onClick={() => handleSave()}>
                                Save
                            </Button>
                        </Box>
                    )
                }
            </Box>
            {HistoryModal}
            {SDModal}
            <NewGoalModal
                open={openNewGoalModal}
                onClose={() => setOpenNewGoalModal(false)}
                goals={matchGoals}
                details={details}
                setDetails={setDetails}
                setCurrentGoalId={setCurrentGoalId}
            />
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
                        <Typography level="h2">
                            {fieldName ? `Match - ${fieldName}` : "Match"}
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
