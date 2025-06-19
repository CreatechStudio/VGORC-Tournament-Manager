import {Box, ButtonGroup, Typography} from "@mui/joy";
import {PAD, SERIAL_NUMBER_KEY, TOURNAMENT_NAME} from "../constants.ts";
import MenuDrawer from "../components/MenuDrawer.tsx";

export default function DashPage() {
    const urlParam = new URLSearchParams(window.location.search);
    const serialNumber = urlParam.get(SERIAL_NUMBER_KEY) || "";

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
                <img src="/TM.png" alt="VEX GO Logo" style={{maxWidth: '100%', height: '100%', maxHeight: '30%'}} />
                <Typography level="h3" sx={{mt: PAD}}>
                    VGORC Tournament Manager
                </Typography>
                <Typography level="h4" sx={{mt: PAD}}>
                    {TOURNAMENT_NAME}
                </Typography>
                <Typography level="h4" sx={{mt: PAD}}>
                    {serialNumber !== "" ? `Display Serial Number: ${serialNumber}` : ""}
                </Typography>
            </Box>
        </Box>
    );
}
