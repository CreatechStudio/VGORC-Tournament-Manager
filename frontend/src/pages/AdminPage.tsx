import {
    accordionDetailsClasses, AccordionGroup,
    accordionSummaryClasses,
    Box,
    ButtonGroup,
    IconButton,
    Typography
} from "@mui/joy";
import {PAD} from "../constants.ts";
import LogoutIcon from '@mui/icons-material/Logout';
import BasicAccordion from "../accordions/BasicAccordion.tsx";
import TournamentAccordion from "../accordions/TournamentAccordion.tsx";
import {useEffect, useState} from "react";
import {getReq} from "../net.ts";
import RefreshIcon from '@mui/icons-material/Refresh';
import {DivisionObject} from "../../../common/Division.ts";

export default function AdminPage() {
    const [disabled, setDisabled] = useState(true);
    const [divisions, setDivisions] = useState<DivisionObject[]>([]);

    useEffect(() => {
        getReq('/utils/database/existed').then((res) => {
            setDisabled(res);
        }).catch();
        handleRefresh();
    }, []);

    function handleLogout() {}

    function handleRefresh() {
        getReq('/division').then((res) => {
            setDivisions(res);
        }).catch();
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
                }}
            >
                <BasicAccordion disabled={disabled}/>
                <TournamentAccordion
                    disabled={disabled}
                    divisions={divisions}
                    setDivisions={setDivisions}
                />
            </AccordionGroup>
        </Box>
    );
}
