import {Box, Grid} from "@mui/joy";
import {Toaster} from "react-hot-toast";
import {routes} from "./route.tsx";
import {HashRouter, Route, Routes} from "react-router-dom";

function App() {
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

export default App;
