import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Autocomplete,
    Avatar, Button,
    FormControl, FormHelperText, FormLabel,
    ListItemContent,
    Table,
    Typography
} from "@mui/joy";
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded';
import {useState} from "react";
import toast from "react-hot-toast";
import {getReq} from "../net.ts";
import {PAD} from "../constants.ts";

enum ScheduleAction {
    Clear,
    Generate
}

type ScheduleActionOption = {
    label: string;
    action: ScheduleAction;
}

const ScheduleActionOptions: ScheduleActionOption[] = [
    {
        label: "Clear",
        action: ScheduleAction.Clear
    },
    {
        label: "Generate",
        action: ScheduleAction.Generate
    }
]

enum MatchType {
    Elimination = "Elimination",
    Qualification = "Qualification"
}

type MatchTypeOption = {
    label: string;
    type: MatchType;
}

const MatchTypeOptions: MatchTypeOption[] = [
    {
        label: "Elimination",
        type: MatchType.Elimination
    },
    {
        label: "Qualification",
        type: MatchType.Qualification
    }
]

export default function TournamentActionAccordion() {
    const [scheduleAction, setScheduleAction] = useState<ScheduleActionOption | null>(null);
    const [matchType, setMatchType] = useState<MatchTypeOption | null>(null);

    function handleDoSchedule() {
        if (scheduleAction && matchType) {
            switch (scheduleAction.action) {
                case ScheduleAction.Clear:
                    getReq("/schedule/clear").then(() => {
                        toast.success("Clear schedule successfully");
                    }).catch();
                    break;
                case ScheduleAction.Generate:
                    getReq(`/schedule/add/${matchType.type}`).then(() => {
                        toast.success("Generate schedule successfully");
                    }).catch();
                    break;
            }
        } else {
            toast.error("Schedule action and match type cannot be empty");
        }
    }

    return (
        <Accordion>
            <AccordionSummary>
                <Avatar color="danger">
                    <AccessibilityNewRoundedIcon />
                </Avatar>
                <ListItemContent>
                    <Typography level="title-md">Tournament Actions</Typography>
                    <Typography level="body-sm">
                        Actions on Tournament
                    </Typography>
                </ListItemContent>
            </AccordionSummary>
            <AccordionDetails>
                <Table borderAxis="none">
                    <tbody>
                    <tr>
                        <td>
                            <FormControl>
                                <FormLabel>
                                    <Typography level="title-lg">
                                        Schedule
                                    </Typography>
                                </FormLabel>
                                <FormHelperText sx={{width: '100%', gap: PAD}}>
                                    <Autocomplete
                                        placeholder="Action"
                                        options={ScheduleActionOptions}
                                        value={scheduleAction}
                                        onChange={(_e, value) => {
                                            setScheduleAction(value);
                                        }}
                                    />
                                    <Autocomplete
                                        placeholder="Match Type"
                                        options={MatchTypeOptions}
                                        value={matchType}
                                        onChange={(_e, value) => {
                                            setMatchType(value);
                                        }}
                                    />
                                </FormHelperText>
                            </FormControl>
                        </td>
                        <td>
                            <Button sx={{width: '100%'}} onClick={() => {
                                handleDoSchedule();
                            }}>
                                Do it!
                            </Button>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </AccordionDetails>
        </Accordion>
    );
}
