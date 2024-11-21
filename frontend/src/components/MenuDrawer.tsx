import MenuIcon from '@mui/icons-material/Menu';
import React, {useState} from 'react';
import {
    Box,
    DialogContent,
    DialogTitle, Divider,
    Drawer,
    IconButton,
    List, ListItemButton,
    ModalClose, Sheet, Typography,
} from "@mui/joy";
import {PAD1_5, PAD2, TOURNAMENT_NAME} from "../constants.ts";
import TocIcon from '@mui/icons-material/Toc';
import {routes} from "../route.tsx";
import {toLocation} from "../net.ts";
import SendToDeviceModal from "./SendToDeviceModal.tsx";

export default function MenuDrawer({
    sendParam
} : {
    sendParam?: string
}) {
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <IconButton onClick={() => setOpen(true)}>
                <MenuIcon/>
            </IconButton>
            <SendToDeviceModal sendParam={sendParam}/>

            <Drawer
                size="md"
                variant="plain"
                open={open}
                onClose={() => setOpen(false)}
                slotProps={{
                    content: {
                        sx: {
                            bgcolor: 'transparent',
                            p: { md: PAD2, sm: 0 },
                            boxShadow: 'none',
                        },
                    },
                }}
            >
                <Sheet
                    sx={{
                        borderRadius: 'md',
                        p: PAD1_5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: PAD1_5,
                        height: '100%',
                        overflow: 'auto',
                    }}
                >
                    <DialogTitle>
                        {TOURNAMENT_NAME}
                    </DialogTitle>
                    <ModalClose/>

                    <Divider/>

                    <DialogContent>
                        <List component="nav">
                            {
                                routes.map((route, i) => (
                                    <ListItemButton
                                        key={i}
                                        onClick={() => {
                                            setOpen(false);
                                            toLocation(route.path);
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                                            width: '100%', alignItems: 'center'
                                        }}>
                                            <Typography>
                                                {route.name}
                                            </Typography>
                                            {route.icon || <TocIcon/>}
                                        </Box>
                                    </ListItemButton>
                                ))
                            }
                        </List>
                    </DialogContent>
                </Sheet>
            </Drawer>
        </React.Fragment>
    );
}
