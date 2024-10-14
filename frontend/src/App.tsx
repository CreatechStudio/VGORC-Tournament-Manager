import {Box, Grid} from "@mui/joy";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import DashPage from "../pages/DashPage.tsx";
import SchedulePage from "../pages/SchedulePage.tsx";
import RankPage from "../pages/RankPage.tsx";
import SkillsRankPage from "../pages/SkillsRankPage.tsx";
import MatchPage from "../pages/MatchPage.tsx";
import AdminPage from "../pages/AdminPage.tsx";
import * as axios from "axios";

export const axiosInstance = axios.default.create({
    baseURL: import.meta.env.BACKEND_URL || "http://localhost:3000"
});

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <DashPage/>
        },
        {
            path: '/schedule',
            element: <SchedulePage/>
        },
        {
            path: '/rank',
            element: <RankPage/>
        },
        {
            path: '/srank',
            element: <SkillsRankPage/>
        },
        {
            path: '/match',
            element: <MatchPage/>
        },
        {
            path: '/admin',
            element: <AdminPage/>
        }
    ]);

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
