import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar, Box,
    ListItemContent, Stack,
    Typography
} from "@mui/joy";
import {DivisionObject} from "../../../common/Division";
import {DEFAULT_DIVISION, DEFAULT_FIELD_SET, DEFAULT_PERIOD, DEFAULT_TEAM, LARGE_PART, PAD} from "../constants";
import {TeamObject} from "../../../common/Team";
import TournamentTable from "../components/TournamentTable";
import {FieldSetObject} from "../../../common/FieldSet.ts";
import {PeriodObject} from "../../../common/Period.ts";
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';

export default function TournamentAccordion({
    divisions,
    setDivisions,
    teams,
    setTeams,
    periods,
    setPeriods,
    fieldSets,
    setFieldSets,
    disabled,
} : {
    divisions: DivisionObject[];
    setDivisions: (divisions: DivisionObject[]) => void;
    teams: TeamObject[];
    setTeams: (teams: TeamObject[]) => void;
    periods: PeriodObject[],
    setPeriods: (periods: PeriodObject[]) => void;
    fieldSets: FieldSetObject[];
    setFieldSets: (sets: FieldSetObject[]) => void;
    disabled?: boolean;
}) {
    return (
        <Accordion>
            <AccordionSummary>
                <Avatar color="success">
                    <PlaylistAddCheckRoundedIcon />
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
                            title="Concurrent Fields"
                        />
                        <TournamentTable
                            arr={divisions}
                            setArr={setDivisions}
                            disabled={disabled}
                            defaultValue={DEFAULT_DIVISION}
                            getDeleteEndpoint={(obj) => `/division/delete/${obj.divisionName}`}
                            updateEndpoint="/division/update"
                            title="Division"
                        />
                        <TournamentTable
                            arr={teams}
                            setArr={setTeams}
                            disabled={disabled}
                            defaultValue={DEFAULT_TEAM}
                            getDeleteEndpoint={(obj) => `/team/delete/${obj.teamNumber}`}
                            updateEndpoint="/team/update"
                            allowUpload
                            title="Team"
                        />
                        <TournamentTable
                            arr={periods}
                            setArr={setPeriods}
                            disabled={disabled}
                            defaultValue={DEFAULT_PERIOD}
                            getDeleteEndpoint={(obj) => `/period/delete/${obj.periodNumber}`}
                            updateEndpoint="/period/update"
                            title="Period"
                        />
                    </Stack>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
}
