import {
    accordionDetailsClasses, AccordionGroup,
    accordionSummaryClasses,
    Box,
    ButtonGroup,
    IconButton,
    Typography
} from "@mui/joy";
import {PAD} from "../src/constants.ts";
import LogoutIcon from '@mui/icons-material/Logout';
import BasicAccordion from "../accordions/BasicAccordion.tsx";
import TournamentAccordion from "../accordions/TournamentAccordion.tsx";

export default function AdminPage() {
    function handleLogout() {

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
                <BasicAccordion/>
                <TournamentAccordion/>
            </AccordionGroup>
        </Box>
    );
}
