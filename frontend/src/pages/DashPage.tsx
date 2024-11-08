import {Box, ButtonGroup, Typography} from "@mui/joy";
import {PAD} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";

export default function DashPage() {
    return (
        <Box sx={{height: '90vh', display: 'flex', flexDirection: 'column', gap: PAD, overflow: 'hidden', width: '100%'}}>
            <Box sx={{
                pl: PAD, pr: PAD, pb: PAD,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Typography level="title-lg">
                    Dashboard
                </Typography>
                <ButtonGroup>
                    <MenuDrawer/>
                </ButtonGroup>
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                <img src="/TM.jpg" alt="VEX GO Logo" style={{maxWidth: '100%', height: 'auto', maxHeight: '30%'}} />
                <Typography level="h3" sx={{mt: 2}}>
                    VGORC Tournament Manager
                </Typography>
            </Box>
        </Box>
    );
}
