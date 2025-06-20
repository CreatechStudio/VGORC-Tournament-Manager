import {AspectRatio, Box, Button, Card, Grid, Sheet, Stack, Typography} from "@mui/joy";
import {Toaster} from "react-hot-toast";
import {routes} from "./route.tsx";
import {HashRouter, Route, Routes} from "react-router-dom";
import React from "react";
import {LARGE_PART, PAD, PAD2} from "./constants.ts";
import {PingPongTest} from "./net.ts";
import FmdBadTwoToneIcon from '@mui/icons-material/FmdBadTwoTone';

type AppProps = object;
interface AppState {
    hasError: boolean;
    backendG: boolean;
}

function GPage({
    errMsg,
    detailMsg = "Please contact with website maintainers to get help.",
    btMsg = "Refresh",
    onClick = () => {window.location.reload()},
} : {
    errMsg: string;
    detailMsg?: string;
    btMsg?: string;
    onClick?: () => void;
}) {
    return (
        <Sheet sx={{
            width: '100%', height: '95vh', overflow: 'hidden', gap: PAD,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <Card color="danger" sx={{width: `${LARGE_PART}%`, minWidth: `${PAD2*5}rem`}} variant="plain">
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    flexGrow="1"
                    gap={PAD}
                    sx={{width: '100%'}}
                >
                    <AspectRatio ratio="1" sx={{width: '20vw'}} variant="plain">
                        <img
                            src="/TM.png"
                            alt=""
                            loading="lazy"
                        />
                    </AspectRatio>
                    <Stack direction="row" gap={PAD/2}>
                        <FmdBadTwoToneIcon/>
                        <Typography level="title-lg">
                            {errMsg}
                        </Typography>
                    </Stack>
                    <Typography level="body-md">
                        {detailMsg}
                    </Typography>
                    <Button onClick={onClick} color="danger">
                        {btMsg}
                    </Button>
                </Stack>
            </Card>
        </Sheet>
    );
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: never) {
        super(props);
        this.state = {
            hasError: false,
            backendG: false,
        };
        PingPongTest(
            () => {
                if (this.state.backendG !== false) {
                    this.setState({backendG: false});
                }
            },
            () => {
                this.setState({backendG: true});
            },
            true
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidCatch(_error: never, _info: never) {
        this.setState({
            hasError: true,
        });
    }

    render() {
        if (this.state.hasError) {
            return <GPage
                errMsg="Whoops! Something Went Wrong!"
                onClick={() => window.history.back()}
                btMsg="Return Back"
            />;
        }

        if (this.state.backendG) {
            return <GPage errMsg="Whoops! Backend Disappeared!"/>;
        }

        return (
            <HashRouter>
                <Box sx={{overflow: 'hidden', userSelect: 'none'}}>
                    <Toaster/>
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{position: 'absolute'}}
                        style={{minHeight: '100vh', left: 0, top: 0, width: '100vw'}}
                    >
                        <Grid xs={10}>
                            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <Routes>
                                    {routes.map((route) => (
                                        <Route
                                            key={route.path}
                                            path={route.path}
                                            element={<route.element/>}
                                        />
                                    ))}
                                </Routes>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </HashRouter>
        );
    }
}

export default App;
