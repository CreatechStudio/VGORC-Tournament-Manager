import {Box, Grid} from "@mui/joy";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import {routes} from "./route.tsx";

function App() {
    const router = createBrowserRouter(routes);

    return (
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
                        <RouterProvider router={router}/>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default App;
