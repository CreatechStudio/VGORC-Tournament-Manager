import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar, Box,
    ListItemContent, Stack,
    Typography
} from "@mui/joy";
import EditNotificationsRoundedIcon from '@mui/icons-material/EditNotificationsRounded';
import {DivisionObject} from "../../../common/Division";
import {DEFAULT_DIVISION, DEFAULT_FIELD_SET, DEFAULT_TEAM, LARGE_PART, PAD} from "../constants";
import {TeamObject} from "../../../common/Team";
import TournamentTable from "../components/TournamentTable";
import {FieldSetObject} from "../../../common/FieldSet.ts";

export default function TournamentAccordion({
    divisions,
    setDivisions,
    teams,
    setTeams,
    fieldSets,
    setFieldSets,
    disabled,
} : {
    divisions: DivisionObject[];
    setDivisions: (divisions: DivisionObject[]) => void;
    teams: TeamObject[];
    setTeams: (teams: TeamObject[]) => void;
    fieldSets: FieldSetObject[];
    setFieldSets: (sets: FieldSetObject[]) => void;
    disabled?: boolean;
}) {
    return (
        <Accordion>
            <AccordionSummary>
                <Avatar color="success">
                    <EditNotificationsRoundedIcon />
                </Avatar>
                <ListItemContent>
                    <Typography level="title-md">Tournament Settings</Typography>
                    <Typography level="body-sm">
                        Enable or disable your notifications
                    </Typography>
                </ListItemContent>
            </AccordionSummary>
            <AccordionDetails sx={{maxHeight: `${LARGE_PART}vh`}}>
                <Box sx={{overflowY: 'scroll', pl: PAD, pr: PAD}}>
                    <Stack spacing={PAD} sx={{pt: PAD, pb: PAD}}>
                        <TournamentTable
                            arr={fieldSets}
                            setArr={setFieldSets}
                            disabled={disabled}
                            defaultValue={DEFAULT_FIELD_SET}
                            getDeleteEndpoint={(obj) => `/fieldset/delete/${obj.fieldSetId}`}
                            updateEndpoint="/fieldset/update"
                        />
                        <TournamentTable
                            arr={divisions}
                            setArr={setDivisions}
                            disabled={disabled}
                            defaultValue={DEFAULT_DIVISION}
                            getDeleteEndpoint={(obj) => `/division/delete/${obj.divisionName}`}
                            updateEndpoint="/division/update"
                        />
                        <TournamentTable
                            arr={teams}
                            setArr={setTeams}
                            disabled={disabled}
                            defaultValue={DEFAULT_TEAM}
                            getDeleteEndpoint={(obj) => `/team/delete/${obj.teamNumber}`}
                            updateEndpoint="/team/update"
                        />
                    </Stack>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
}
