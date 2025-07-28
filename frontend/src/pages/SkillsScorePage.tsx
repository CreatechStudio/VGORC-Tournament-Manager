import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    Grid,
    IconButton,
    Input,
    List,
    ListItem, Option, Select,
    Stack,
    Typography
} from "@mui/joy";
import {PAD, PAD2, SMALL_PART} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";
import {useEffect, useState} from "react";
import {TeamObject} from "../../../common/Team.ts";
import {getReq, logout, postReq, toLocation} from "../net.ts";
import LogoutIcon from "@mui/icons-material/Logout";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {SkillType} from "../../../common/Skill.ts";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import toast from "react-hot-toast";
import Timer from "../components/Timer.tsx";
import {
    array2ScoreDetails,
    getCountFromMatchGoalId,
    getNameFromMatchGoalId, getPointsFromMatchGoalId,
    MatchGoalArrayItem,
    matchGoals2Array,
    ScoreDetail,
    scoreDetails2Array
} from "../utils/MatchGoal.ts";
import {AdminObject} from "../../../common/Admin.ts";
import NewGoalModal from "../components/NewGoalModal.tsx";
import useScoreDetailModal from "../components/ScoreDetailModal.tsx";
import {DEFAULT_MATCH_OBJECT} from "../../../common/Match.ts";

const TEAM_NUMBER_KEY = "teamNumber";
const SKILL_TYPE_KEY = "skillType";
const DISPLAY_MODE_KEY = "displayMode";
const FIELD_NAME_KEY = "fieldName";

function ChooseTeam() {
    const [teams, setTeams] = useState<TeamObject[]>([]);

    useEffect(() => {
        document.title = "VGORC TM | Select Team";
        getReq('/team').then((res) => {
            setTeams(res);
        }).catch();
    }, []);

    return (
        <List sx={{gap: PAD, overflowY: 'auto'}}>
            {
                teams.map((t, i) => (
                    <ListItem key={i} sx={{width: '100%'}}>
                        <Button
                            sx={{width: '100%'}}
                            variant="soft"
                            size="lg"
                            onClick={() => {
                                const params = {};
                                // @ts-expect-error params is an undefined object
                                params[TEAM_NUMBER_KEY] = t.teamNumber;
                                toLocation('sscore', params);
                            }}
                        >
                            {t.teamNumber}
                        </Button>
                    </ListItem>
                ))
            }
        </List>
    );
}

function ChooseSkillType({
    teamNumber,
} : {
    teamNumber: string;
}) {
    function handleSetType(t: SkillType) {
        const params = {};
        // @ts-expect-error params is an undefined object
        params[TEAM_NUMBER_KEY] = teamNumber;
        // @ts-expect-error params is an undefined object
        params[SKILL_TYPE_KEY] = t;
        toLocation('sscore', params);
    }

    useEffect(() => {
        document.title = `VGORC TM | Skills Score - ${teamNumber}`;
    }, []);

    return (
        <Stack gap={PAD2}>
            <Button
                onClick={() => handleSetType(SkillType.autoSkillDetails)}
                variant="soft" size="lg"
            >
                Autonomous
            </Button>
            <Button
                onClick={() => handleSetType(SkillType.driverSkillDetails)}
                variant="soft" size="lg"
            >
                Driver
            </Button>
        </Stack>
    );
}

function SetScorePage({
    teamNumber,
    skillType,
    displayMode,
    fieldName
} : {
    teamNumber: string;
    skillType: SkillType;
    displayMode: boolean;
    fieldName: string | null;
}) {
    const [field, setField] = useState(fieldName);
    const [fields, setFields] = useState([]);
    const [detailss, setDetailss] = useState<ScoreDetail[][]>([]);
    const [matchGoals, setMatchGoals] = useState<MatchGoalArrayItem[]>([]);
    const [currentGoalIds, setCurrentGoalIds] = useState<string[]>([]);
    const [openNewGoalModals, setOpenNewGoalModals] = useState<boolean[]>([false, false, false]);
    const [setSDModalOpen0, setSDModalDetails0, setSDModalGoals0, setSDModalTotal0, SDModal0] = useScoreDetailModal();
    const [setSDModalOpen1, setSDModalDetails1, setSDModalGoals1, setSDModalTotal1, SDModal1] = useScoreDetailModal();
    const [setSDModalOpen2, setSDModalDetails2, setSDModalGoals2, setSDModalTotal2, SDModal2] = useScoreDetailModal();

    useEffect(() => {
        document.title = `VGORC TM | Skills Score - ${teamNumber}`;
        if (!displayMode) {
            getReq(`/skill/${teamNumber}`).then((res) => {
                const newDetailss: ScoreDetail[][] = [];
                res[skillType].forEach((i: {[goalKey: string]: number}) => {
                    const newArr = scoreDetails2Array(i);
                    newDetailss.push(newArr);
                    if (newArr.length > 0) {
                        currentGoalIds.push(newArr[0].goalId);
                    }
                });
                setDetailss(newDetailss);
            }).catch();
            getReq('/skill/fields').then((res) => {
                setFields(res);
            }).catch();
            getReq('/admin').then((res: AdminObject) => {
                if (res) {
                    setMatchGoals(matchGoals2Array(res.matchGoals));
                }
            }).catch();
        }
    }, []);

    useEffect(() => {
        setSDModalGoals0(matchGoals);
        setSDModalGoals1(matchGoals);
        setSDModalGoals2(matchGoals);
    }, [matchGoals]);

    useEffect(() => {
        if (detailss[0]) {
            setSDModalDetails0(detailss[0]);
            setSDModalTotal0(getTotal(0));
        }
        if (detailss[1]) {
            setSDModalDetails1(detailss[1]);
            setSDModalTotal1(getTotal(1));
        }
        if (detailss[2]) {
            setSDModalDetails2(detailss[2]);
            setSDModalTotal2(getTotal(2));
        }
    }, [detailss]);

    function setOpenNewGoalModal(open: boolean, index: number) {
        const newOpenNewGoalModals = [...openNewGoalModals];
        newOpenNewGoalModals[index] = open;
        setOpenNewGoalModals(newOpenNewGoalModals);
    }

    function setCurrentGoalId(goalId: string, index: number) {
        const newGoalIds: string[] = [...currentGoalIds];
        newGoalIds[index] = goalId;
        setCurrentGoalIds(newGoalIds);
    }

    function setCount(count: number, index: number) {
        const goalIndex = detailss[index].findIndex((detail => detail.goalId === currentGoalIds[index]));
        if (goalIndex !== -1) {
            const newDetailss = [...detailss];
            newDetailss[index][goalIndex].count = count;
            setDetailss(newDetailss);
        }
    }

    function handleChangeInput(newInput: string, index: number) {
        const inp = newInput.trim();
        if (inp === "0") {
            setCount(0, index);
        } else {
            const newCount = parseInt(inp) ?? (detailss[index].find((detail) => detail.goalId === currentGoalIds[index]) ?? {count: 0}).count ?? 0;
            setCount(newCount, index);
        }
    }

    function handleNew() {
        const newDetailss = [...detailss];
        newDetailss.push([]);
        setDetailss(newDetailss);
    }

    function handleDelete(index: number) {
        const newDetailss = [...detailss];
        newDetailss.splice(index, 1);
        setDetailss(newDetailss);
    }

    function getEndDecorateString(index: number) {
        switch (index) {
            case 0: return "First Trail";
            case 1: return "Second Trail";
            case 2: return "Third Trail";
            default: return "Unknown Trail";
        }
    }

    function handleSave() {
        const detailssArr: {[goalId: string]: number}[] = [];
        detailss.forEach((details) => {
            detailssArr.push(array2ScoreDetails(details));
        });
        console.log(detailssArr);
        postReq('/skill/update', {
            teamNumber: teamNumber,
            skillType: skillType,
            scoreDetails: detailssArr
        }).then(() => {
            toast.success("Save successfully");
        }).catch();
    }

    function getTotal(index: number) {
        if (detailss[index]) {
            let total = 0;
            detailss[index].forEach((detail) => {
                total += detail.count * getPointsFromMatchGoalId(matchGoals, detail.goalId);
            });
            return total;
        }
        return 0;
    }

    function setDetails(details: ScoreDetail[], index: number) {
        const newDetailss = [...detailss];
        newDetailss[index] = details;
        setDetailss(newDetailss);
    }

    function setSDModalOpen(open: boolean, index: number) {
        switch (index) {
            case 0: setSDModalOpen0(open); break;
            case 1: setSDModalOpen1(open); break;
            case 2: setSDModalOpen2(open); break;
            default: console.error("Invalid index for score detail modal:", index);
        }
    }

    function getSDModal(index: number) {
        switch (index) {
            case 0: return SDModal0;
            case 1: return SDModal1;
            case 2: return SDModal2;
            default: console.error("Invalid index for score detail modal:", index);
                return null;
        }
    }

    return (
        <Stack sx={{height: '100%'}}>
            <Box sx={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}>
                {
                    displayMode ? <>
                            <Typography level="h3">
                                {fieldName}
                            </Typography>
                        </> :
                    <>
                        <Typography level="h2">
                            Score - {teamNumber}: {skillType === SkillType.autoSkillDetails ? "Autonomous" : "Drivers"}
                        </Typography>
                        <ButtonGroup size="lg">
                            <MenuDrawer sendParam={`${FIELD_NAME_KEY}=${field}`}/>
                            <IconButton onClick={() => logout()}>
                                <LogoutIcon/>
                            </IconButton>
                        </ButtonGroup>
                    </>
                }
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
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: PAD2
                        }}>
                            <Timer
                                displayMode={displayMode}
                                current={{...DEFAULT_MATCH_OBJECT, matchField: field || ""}}
                                fieldName={fieldName}
                            />
                            {
                                displayMode ? <></> :
                                    <Autocomplete
                                        options={fields}
                                        value={field}
                                        onChange={(_e, v) => setField(v)}
                                        placeholder="Field"
                                    />
                            }
                            {
                                displayMode ? <></> :
                                detailss.map((details, index) => (
                                    <Stack width="100%" justifyContent="center" alignItems="center" gap={PAD2}>
                                        <Stack
                                            direction="row" width="100%"
                                            justifyContent="space-around" alignItems="center"
                                        >
                                            <Select
                                            onChange={(_e, value) => setCurrentGoalId(value ?? "", index)}
                                            value={currentGoalIds[index]}
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
                                                setCount(getCountFromMatchGoalId(details, currentGoalIds[index]) - 1, index);
                                            }}>
                                                <RemoveIcon/>
                                            </IconButton>
                                            <Input
                                                value={getCountFromMatchGoalId(details, currentGoalIds[index])}
                                                size="lg"
                                                sx={{textAlign: 'center', flexGrow: 1, maxWidth: `${SMALL_PART}vw`}}
                                                onChange={(e) => handleChangeInput(e.target.value, index)}
                                                endDecorator={
                                                    <Typography level="body-md" color="neutral">
                                                        {getEndDecorateString(index)}
                                                    </Typography>
                                                }
                                            />
                                            <IconButton variant="outlined" size="lg" onClick={() => {
                                                setCount(getCountFromMatchGoalId(details, currentGoalIds[index]) + 1, index);
                                            }}>
                                                <AddIcon/>
                                            </IconButton>
                                            <IconButton variant="outlined" size="lg" onClick={() => {
                                                const success = confirm("Make sure you want to delete this attempt.");
                                                if (success) {
                                                    handleDelete(index);
                                                }
                                            }}>
                                                <DeleteOutlineOutlinedIcon/>
                                            </IconButton>
                                            <Button
                                                startDecorator={<AddIcon/>}
                                                variant="outlined"
                                                onClick={() => setOpenNewGoalModal(true, index)}
                                                size="lg"
                                            >
                                                New Goal
                                            </Button>
                                            <Stack justifyContent="center" alignItems="center">
                                                <Typography level="title-lg">
                                                    Total: {getTotal(index)}
                                                </Typography>
                                                <Typography
                                                    onClick={() => setSDModalOpen(true, index)}
                                                    sx={{cursor: "pointer", textDecoration: "underline"}}
                                                    color="primary"
                                                >
                                                    View Details
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <NewGoalModal
                                            open={openNewGoalModals[index]}
                                            onClose={() => setOpenNewGoalModal(false, index)}
                                            goals={matchGoals}
                                            details={details}
                                            setDetails={(newDetails) => setDetails(newDetails, index)}
                                            setCurrentGoalId={(goalId) => setCurrentGoalId(goalId ?? "", index)}
                                        />
                                        {getSDModal(index)}
                                    </Stack>
                                ))
                            }
                            {
                                displayMode ? <></> :
                                    detailss.length < 3 ?
                                    <Button
                                        variant="outlined"
                                        size="lg"
                                        startDecorator={
                                            <AddIcon/>
                                        }
                                        onClick={() => {
                                            handleNew()
                                        }}
                                        sx={{mt: PAD2}}
                                    >
                                        New Attempt
                                    </Button>
                                    : <></>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box>
                {
                    displayMode ? <></> :
                        <Button size="lg" fullWidth onClick={() => handleSave()}>
                            Save
                        </Button>
                }
            </Box>
        </Stack>
    );
}

export default function SkillsScorePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const teamNumber = urlParams.get(TEAM_NUMBER_KEY);
    const skillType = urlParams.get(SKILL_TYPE_KEY);
    const displayMode = urlParams.get(DISPLAY_MODE_KEY) !== null;
    const fieldName = urlParams.get(FIELD_NAME_KEY);

    const directDisplay = displayMode && fieldName !== null;

    function GetContent() {
        if (teamNumber || directDisplay) {
            if (skillType || directDisplay) {
                return <SetScorePage
                    teamNumber={teamNumber || ""}
                    displayMode={displayMode}
                    fieldName={fieldName}
                    // @ts-expect-error skillType is a string
                    skillType={skillType}
                />;
            } else {
                return <ChooseSkillType
                    teamNumber={teamNumber || ""}
                />;
            }
        } else {
            return <ChooseTeam/>;
        }
    }

    return (
        <Box sx={{height: '90vh', display: 'flex', flexDirection: 'column', gap: PAD, overflow: 'hidden', width: '100%'}}>
            {
                directDisplay || (teamNumber && skillType) ? <></> :
                    <Box sx={{
                        pl: PAD, pr: PAD, pb: PAD,
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <Typography level="title-lg">
                            Skills Score
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
