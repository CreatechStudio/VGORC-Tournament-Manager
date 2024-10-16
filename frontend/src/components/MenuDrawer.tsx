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
import {PAD1_5, PAD2} from "../constants.ts";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TocIcon from '@mui/icons-material/Toc';
import GamepadIcon from '@mui/icons-material/Gamepad';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function MenuDrawer() {
    const [open, setOpen] = useState(false);

    const routes = [
        {
            path: '/',
            name: "Dashboard",
            icon: <DashboardIcon/>
        },
        {
            path: '/schedule',
            name: "Schedule",
            icon: <ScheduleIcon/>
        },
        {
            path: '/rank',
            name: "Rank",
            icon: <StarBorderIcon/>
        },
        {
            path: '/srank',
            name: "Skills Rank",

        },
        {
            path: '/match',
            name: "Matches",
            icon: <GamepadIcon/>
        },
        {
            path: '/admin',
            name: "Admin",
            icon: <AdminPanelSettingsIcon/>
        }
    ];

    return (
        <React.Fragment>
            <IconButton onClick={() => setOpen(true)}>
                <MenuIcon/>
            </IconButton>

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
                        {import.meta.env.VITE_TOURNAMENT_NAME || "VGORC"}
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
                                            window.location.href = route.path;
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
