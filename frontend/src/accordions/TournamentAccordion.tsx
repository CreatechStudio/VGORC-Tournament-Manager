import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    ListItemContent, Stack,
    Typography
} from "@mui/joy";
import EditNotificationsRoundedIcon from '@mui/icons-material/EditNotificationsRounded';
import {DivisionObject} from "../../../common/Division";
import {DEFAULT_DIVISION, DEFAULT_TEAM, PAD} from "../constants";
import {TeamObject} from "../../../common/Team";
import TournamentTable from "../components/TournamentTable";

export default function TournamentAccordion({
    divisions,
    setDivisions,
    teams,
    setTeams,
    disabled,
} : {
    divisions: DivisionObject[];
    setDivisions: (divisions: DivisionObject[]) => void;
    teams: TeamObject[];
    setTeams: (teams: TeamObject[]) => void;
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
            <AccordionDetails sx={{pl: PAD, pr: PAD}}>
                <Stack spacing={PAD} sx={{pt: PAD, pb: PAD}}>
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
            </AccordionDetails>
        </Accordion>
    );
}
