import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import GamepadIcon from '@mui/icons-material/Gamepad';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import DashPage from "./pages/DashPage.tsx";
import SchedulePage from "./pages/SchedulePage.tsx";
import RankPage from "./pages/RankPage.tsx";
import SkillsRankPage from "./pages/SkillsRankPage.tsx";
import MatchPage from "./pages/MatchPage.tsx";
import ScorePage from "./pages/ScorePage.tsx";
import AdminPage from "./pages/AdminPage.tsx";

export const routes = [
    {
        path: '/',
        name: "Dashboard",
        icon: <DashboardIcon/>,
        element: <DashPage/>
    },
    {
        path: '/schedule',
        name: "Schedule",
        icon: <ScheduleIcon/>,
        element: <SchedulePage/>
    },
    {
        path: '/rank',
        name: "Rank",
        icon: <StarBorderIcon/>,
        element: <RankPage/>
    },
    {
        path: '/srank',
        name: "Skills Rank",
        element: <SkillsRankPage/>
    },
    {
        path: '/match',
        name: "Matches",
        icon: <GamepadIcon/>,
        element: <MatchPage/>
    },
    {
        path: '/score',
        name: "Score",
        icon: <ScoreboardOutlinedIcon/>,
        element: <ScorePage/>
    },
    {
        path: '/admin',
        name: "Admin",
        icon: <AdminPanelSettingsIcon/>,
        element: <AdminPage/>
    }
];
