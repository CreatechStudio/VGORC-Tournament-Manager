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
import {PeriodObject} from "../../../common/Period.ts";
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import toast from "react-hot-toast";
import TournamentActionAccordion from "../accordions/TournamentActionAccordion.tsx";

export default function AdminPage() {
    const [disabled, setDisabled] = useState(true);
    const [divisions, setDivisions] = useState<DivisionObject[]>([]);
    const [teams, setTeams] = useState<TeamObject[]>([]);
    const [fieldSets, setFieldSets] = useState<FieldSetObject[]>([]);
    const [periods, setPeriods] = useState<PeriodObject[]>([]);

    useEffect(() => {
        getReq('/utils/database/isLocked').then((res) => {
            setDisabled(res);
        }).catch();
        handleRefresh();
    }, []);

    function handleLogout() {
        logout();
    }

    function handleRefresh() {
        getReq('/division/all').then((res) => {
            setDivisions(res);
        });
        getReq('/team').then((res) => {
            setTeams(res);
        });
        getReq('/fieldset').then((res) => {
            setFieldSets(res);
        });
        getReq('/period').then((res) => {
            setPeriods(res);
        });
    }

    function handleLock() {
        if (disabled) {
            toast.error("Cannot unlock database");
        } else {
            const sure = confirm("You cannot unlock database again. Are you sure about that?");
            if (sure) {
                getReq('/utils/database/lock').then(() => {
                    setDisabled(true);
                    toast.success("Database locked");
                }).catch();
            }
        }
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
                    <IconButton onClick={() => handleLock()}>
                        {
                            disabled ? <LockOutlinedIcon/> : <LockOpenOutlinedIcon/>
                        }
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
                <BasicAccordion/>
                <TournamentAccordion
                    disabled={disabled}
                    divisions={divisions}
                    setDivisions={setDivisions}
                    teams={teams}
                    setTeams={setTeams}
                    periods={periods}
                    setPeriods={setPeriods}
                    fieldSets={fieldSets}
                    setFieldSets={setFieldSets}
                />
                <TournamentActionAccordion/>
            </AccordionGroup>
        </Box>
    );
}
