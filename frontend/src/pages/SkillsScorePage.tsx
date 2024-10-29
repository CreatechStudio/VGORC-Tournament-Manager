import {Box, Button, ButtonGroup, Grid, IconButton, Input, List, ListItem, Stack, Typography} from "@mui/joy";
import {PAD, PAD2, SMALL_PART} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";
import {useEffect, useState} from "react";
import {TeamObject} from "../../../common/Team.ts";
import {getReq, logout, postReq} from "../net.ts";
import LogoutIcon from "@mui/icons-material/Logout";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {SkillType} from "../../../common/Skill.ts";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import toast from "react-hot-toast";

const TEAM_NUMBER_KEY = "teamNumber";
const SKILL_TYPE_KEY = "skillType";

function ChooseTeam() {
    const [teams, setTeams] = useState<TeamObject[]>([]);

    useEffect(() => {
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
                                window.location.href = `/sscore?${TEAM_NUMBER_KEY}=${t.teamNumber}`;
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
        window.location.href = `/sscore?${TEAM_NUMBER_KEY}=${teamNumber}&${SKILL_TYPE_KEY}=${t}`;
    }

    return (
        <Stack gap={PAD2}>
            <Button
                onClick={() => handleSetType(SkillType.autoSkill)}
                variant="soft" size="lg"
            >
                Autonomous
            </Button>
            <Button
                onClick={() => handleSetType(SkillType.driverSkill)}
                variant="soft" size="lg"
            >
                Driver
            </Button>
        </Stack>
    );
}

function SetScorePage({
    teamNumber,
    skillType
} : {
    teamNumber: string;
    skillType: SkillType;
}) {
    const [scores, setScores] = useState<number[]>([]);

    useEffect(() => {
        getReq(`/skill/${teamNumber}`).then((res) => {
            setScores(res[skillType]);
        }).catch();
    }, []);

    function setScore(index: number, score: number) {
        const newScores: number[] = JSON.parse(JSON.stringify(scores));
        newScores[index] = Math.max(score, 0);
        setScores(newScores);
    }

    function handleChangeInput(index: number, newInput: string) {
        const inp = newInput.trim();
        if (inp === "0") {
            setScore(index, 0);
        } else {
            const newScore = parseInt(inp) || scores[index] || 0;
            setScore(index, newScore);
        }
    }

    function handleNew() {
        const newScores: number[] = JSON.parse(JSON.stringify(scores));
        newScores.push(0);
        setScores(newScores);
    }

    function handleDelete(index: number) {
        const newScores: number[] = JSON.parse(JSON.stringify(scores));
        newScores.splice(index, 1);
        setScores(newScores);
        handleSave(newScores);
    }

    function getEndDecorateString(index: number) {
        switch (index) {
            case 0: return "First Trail";
            case 1: return "Second Trail";
            case 2: return "Third Trail";
            default: return "Unknown Trail";
        }
    }

    function handleSave(newScores?: number[]) {
        postReq('/skill/update', {
            teamNumber: teamNumber,
            skillType: skillType,
            scores: newScores || scores
        }).then(() => {
            toast.success("Save successfully");
        }).catch();
    }

    return (
        <Stack sx={{height: '100%'}}>
            <Box sx={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Typography level="h2">
                    Score - {teamNumber} {skillType}
                </Typography>
                <ButtonGroup size="lg">
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
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: PAD2
                        }}>
                            {
                                scores.map((score, index) => (
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        width: '100%',
                                        gap: PAD2,
                                    }} key={index}>
                                        <IconButton variant="outlined" size="lg" onClick={() => {
                                            setScore(index, score - 1);
                                        }}>
                                            <RemoveIcon/>
                                        </IconButton>
                                        <Input
                                            value={score}
                                            size="lg"
                                            sx={{textAlign: 'center', flexGrow: 1, maxWidth: `${SMALL_PART}vw`}}
                                            onChange={(e) => handleChangeInput(index, e.target.value)}
                                            endDecorator={
                                                <Typography level="body-md" color="neutral">
                                                    {getEndDecorateString(index)}
                                                </Typography>
                                            }
                                        />
                                        <IconButton variant="outlined" size="lg" onClick={() => {
                                            setScore(index, score + 1);
                                        }}>
                                            <AddIcon/>
                                        </IconButton>
                                        <IconButton variant="outlined" size="lg" onClick={() => {
                                            handleDelete(index);
                                        }}>
                                            <DeleteOutlineOutlinedIcon/>
                                        </IconButton>
                                    </Box>
                                ))
                            }
                            {
                                scores.length < 3 ?
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
                                        New Score
                                    </Button>
                                    : <></>
                            }
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

export default function SkillsScorePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const teamNumber = urlParams.get(TEAM_NUMBER_KEY);
    const skillType = urlParams.get(SKILL_TYPE_KEY);

    function GetContent() {
        if (teamNumber) {
            if (skillType) {
                return <SetScorePage
                    teamNumber={teamNumber}
                    // @ts-ignore
                    skillType={skillType}
                />;
            } else {
                return <ChooseSkillType
                    teamNumber={teamNumber}
                />;
            }
        } else {
            return <ChooseTeam/>;
        }
    }

    return (
        <Box sx={{height: '90vh', display: 'flex', flexDirection: 'column', gap: PAD, overflow: 'hidden', width: '100%'}}>
            {
                teamNumber && skillType ? <></> :
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
