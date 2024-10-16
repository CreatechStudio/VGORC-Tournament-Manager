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
        </Box>
    );
}
