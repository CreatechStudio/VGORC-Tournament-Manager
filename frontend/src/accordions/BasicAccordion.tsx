import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar, Button,
    FormControl, FormHelperText, FormLabel, Input,
    ListItemContent,
    Table,
    Typography
} from "@mui/joy";
import {useEffect, useState} from "react";
import {DEFAULT_MATCH_GOAL_ITEM, PAD} from "../constants.ts";
import {AdminObject, MatchGoal} from "../../../common/Admin.ts";
import {getReq, postReq} from "../net.ts";
import toast from "react-hot-toast";
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import TournamentTable from "../components/TournamentTable.tsx";

export interface MatchGoalArrayItem {
    id: string, name: string, points: number
}

export default function BasicAccordion({
    disabled
} : {
    disabled: boolean
}) {
    const [data, setData] = useState<AdminObject>({
        playerDuration: 60,
        eliminationAllianceCount: 5,
        matchGoals: {}
    });

    const [goals, setGoals] = useState<MatchGoalArrayItem[]>([]);

    useEffect(() => {
        setData({
            ...data,
            matchGoals: array2MatchGoals(goals)
        });
    }, [goals, setGoals]);

    useEffect(() => {
        getReq("/admin").then((res: AdminObject) => {
            if (res) {
                setData(res);
                setGoals(matchGoals2Array(res.matchGoals));
            }
        }).catch();
    }, []);

    function matchGoals2Array(matchGoals: {[key: string]: MatchGoal}): MatchGoalArrayItem[] {
        const result: MatchGoalArrayItem[] = [];
        Object.keys(matchGoals).forEach(key => {
            result.push({
                id: key,
                name: matchGoals[key].name,
                points: matchGoals[key].points
            });
        });
        return result;
    }

    function array2MatchGoals(arr: MatchGoalArrayItem[]): {[key: string]: MatchGoal} {
        const matchGoals: {[key: string]: MatchGoal} = {};
        arr.forEach((goal) => {
            matchGoals[goal.id] = {
                name: goal.name,
                points: goal.points
            };
        });
        return matchGoals;
    }

    function handleSave(newData?: AdminObject) {
        postReq("/admin/update", {
            data: newData ?? data
        }).then((res) => {
            if (res) {
                setData(res);
                toast.success("Save successfully");
            }
        }).catch(() => {
            toast.error("Failed to save data");
        });
    }

    function handleSaveGoals(goals: MatchGoalArrayItem[]) {
        setGoals(goals);
        const newData: AdminObject = {
            ...data,
            matchGoals: array2MatchGoals(goals)
        };
        setData(newData);
        handleSave(newData);
    }

    function setPlayerDuration(duration: number) {
        setData({
            ...data,
            playerDuration: duration
        });
    }

    function setEliminationAllianceCount(count: number) {
        setData({
            ...data,
            eliminationAllianceCount: count
        });
    }

    function parseIntegerResult(data: string, oldValue: number) {
        const d = data.trim();
        const value = parseInt(d);
        if (value === 0 && d === "0") {
            return 0;
        } else {
            return value || oldValue;
        }
    }

    return (
        <Accordion sx={{width: '100%'}}>
            <AccordionSummary>
                <Avatar color="primary">
                    <SettingsRoundedIcon />
                </Avatar>
                <ListItemContent>
                    <Typography level="title-md">General Settings</Typography>
                    <Typography level="body-sm">
                        General settings for a tournament
                    </Typography>
                </ListItemContent>
                <Button variant="soft" onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleSave();
                }} disabled={disabled}>
                    Save
                </Button>
            </AccordionSummary>
            <AccordionDetails>
                <Table size="lg">
                    <tbody>
                    <tr>
                        <td>
                            <FormControl sx={{p: PAD}}>
                                <FormLabel>Duration / Match</FormLabel>
                                <FormHelperText>
                                    in second
                                </FormHelperText>
                            </FormControl>
                        </td>
                        <td>
                            <Input
                                variant="soft"
                                value={data.playerDuration}
                                onChange={(e) =>
                                    setPlayerDuration(parseIntegerResult(e.target.value, data.playerDuration))
                                }
                                sx={{flexGrow: 1}}
                                disabled={disabled}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <FormControl sx={{p: PAD}}>
                                <FormLabel>Elimination Alliances</FormLabel>
                                <FormHelperText>
                                    Number of alliances advanced to elimination.
                                </FormHelperText>
                            </FormControl>
                        </td>
                        <td>
                            <Input
                                variant="soft"
                                value={data.eliminationAllianceCount}
                                onChange={(e) =>
                                    setEliminationAllianceCount(parseIntegerResult(e.target.value, data.eliminationAllianceCount))
                                }
                                sx={{flexGrow: 1}}
                                disabled={disabled}
                            />
                        </td>
                    </tr>
                    </tbody>
                </Table>
                <TournamentTable
                    arr={goals}
                    setArr={setGoals}
                    defaultValue={DEFAULT_MATCH_GOAL_ITEM}
                    onSave={handleSaveGoals}
                    title="Match Goals"
                />
            </AccordionDetails>
        </Accordion>
    );
}
