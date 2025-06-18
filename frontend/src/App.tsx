import {Box, Button, Card, Grid, Sheet, Typography} from "@mui/joy";
import {Toaster} from "react-hot-toast";
import {routes} from "./route.tsx";
import {HashRouter, Route, Routes} from "react-router-dom";
import React from "react";
import {LARGE_PART, PAD, PAD2} from "./constants.ts";
import {PingPongTest} from "./net.ts";

type AppProps = object;
interface AppState {
    hasError: boolean;
    backendG: boolean;
}

function WrongPage() {
    return (
        <Sheet sx={{
            width: '100%', height: '95vh', overflow: 'hidden', gap: PAD,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <Card color="danger" sx={{width: `${LARGE_PART}%`, minWidth: `${PAD2*5}rem`}}>
                <Typography level="title-lg">
                    Something went wrong!
                </Typography>
                <Typography level="body-md">
                    Please contact with website maintainers to get help or back to last page.
                </Typography>
                <Button onClick={() => {
                    window.history.back();
                }} color="danger">
                    Return Back
                </Button>
            </Card>
        </Sheet>
    );
}

function BackendGPage() {
    return (
        <Sheet sx={{
            width: '100%', height: '95vh', overflow: 'hidden', gap: PAD,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <Card color="danger" sx={{width: `${LARGE_PART}%`, minWidth: `${PAD2*5}rem`}}>
                <Typography level="title-lg">
                    Backend Not Exist!
                </Typography>
                <Typography level="body-md">
                    Please contact with website maintainers to get help.
                </Typography>
                <Button onClick={() => {
                    window.location.reload();
                }} color="danger">
                    Refresh
                </Button>
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
                this.setState({backendG: false});
            },
            () => {
                this.setState({backendG: true})
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
            return <WrongPage/>;
        }

        if (this.state.backendG) {
            return <BackendGPage/>;
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
