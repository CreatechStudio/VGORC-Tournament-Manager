import {
    accordionDetailsClasses, AccordionGroup,
    accordionSummaryClasses,
    Box,
    ButtonGroup,
    IconButton,
    Typography
} from "@mui/joy";
import {PAD} from "../constants";
import LogoutIcon from '@mui/icons-material/Logout';
import BasicAccordion from "../accordions/BasicAccordion";
import TournamentAccordion from "../accordions/TournamentAccordion";
import {useEffect, useState} from "react";
import {getReq, logout} from "../net";
import RefreshIcon from '@mui/icons-material/Refresh';
import {DivisionObject} from "../../../common/Division";
import MenuDrawer from "../components/MenuDrawer";
import {TeamObject} from "../../../common/Team";
import {FieldSetObject} from "../../../common/FieldSet";

export default function AdminPage() {
    const [disabled, setDisabled] = useState(true);
    const [divisions, setDivisions] = useState<DivisionObject[]>([]);
    const [teams, setTeams] = useState<TeamObject[]>([]);
    const [fieldSets, setFieldSets] = useState<FieldSetObject[]>([]);

    useEffect(() => {
        getReq('/utils/database/existed').then((res) => {
            setDisabled(res);
        }).catch();
        handleRefresh();
    }, []);

    function handleLogout() {
        logout();
    }

    function handleRefresh() {
        getReq('/division').then((res) => {
            setDivisions(res);
        });
        getReq('/team').then((res) => {
            setTeams(res);
        });
        getReq('/fieldset').then((res) => {
            setFieldSets(res);
        });
    }

    return (
        <Box sx={{height: '90vh', display: 'flex', flexDirection: 'column', gap: PAD, overflow: 'hidden', width: '100%'}}>
            <Box sx={{
                pl: PAD, pr: PAD, pb: PAD,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Typography level="title-lg">
                    Admin
                </Typography>
                <ButtonGroup>
                    <IconButton onClick={() => handleRefresh()}>
                        <RefreshIcon/>
                    </IconButton>
                    <MenuDrawer/>
                    <IconButton onClick={() => handleLogout()}>
                        <LogoutIcon/>
                    </IconButton>
                </ButtonGroup>
            </Box>
            <AccordionGroup
                variant="plain"
                transition="0.2s"
                size="lg"
                sx={{
                    width: '100%',
                    borderRadius: 'md',
                    [`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]:
                        {
                            paddingBlock: '1rem',
                        },
                    [`& .${accordionSummaryClasses.button}`]: {
                        paddingBlock: '1rem',
                    },
                    overflowY: 'scroll'
                }}
            >
                <BasicAccordion disabled={disabled}/>
                <TournamentAccordion
                    disabled={disabled}
                    divisions={divisions}
                    setDivisions={setDivisions}
                    teams={teams}
                    setTeams={setTeams}
                    fieldSets={fieldSets}
                    setFieldSets={setFieldSets}
                />
            </AccordionGroup>
        </Box>
    );
}
