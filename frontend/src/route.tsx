import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import DashPage from "./pages/DashPage.tsx";
import SchedulePage from "./pages/SchedulePage.tsx";
import { QualificationRankPage, EliminationRankPage } from "./pages/RankPage.tsx";
import SkillsRankPage from "./pages/SkillsRankPage.tsx";
import ScorePage from "./pages/ScorePage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import LoginIcon from '@mui/icons-material/Login';
import LoginPage from "./pages/LoginPage.tsx";
import SkillsScorePage from "./pages/SkillsScorePage.tsx";
import DisplayPage from "./pages/DisplayPage.tsx";
import ConnectedTvIcon from '@mui/icons-material/ConnectedTv';

export const routes = [
    {
        path: '',
        name: "Dashboard",
        icon: <DashboardIcon/>,
        element: DashPage
    },
    {
        path: 'schedule',
        name: "Schedule",
        icon: <ScheduleIcon/>,
        element: SchedulePage
    },
    {
        path: 'qrank',
        name: "Qualification Rank",
        icon: <StarBorderIcon/>,
        element: QualificationRankPage
    },
    {
        path: 'erank',
        name: "Elimination Rank",
        icon: <StarBorderIcon/>,
        element: EliminationRankPage
    },
    {
        path: 'srank',
        name: "Skills Rank",
        element: SkillsRankPage
    },
    {
        path: 'score',
        name: "Match",
        icon: <ScoreboardOutlinedIcon/>,
        element: ScorePage
    },
    {
        path: 'sscore',
        name: 'Skills Score',
        icon: <ScoreboardOutlinedIcon/>,
        element: SkillsScorePage
    },
    {
        path: 'login',
        name: "Login",
        icon: <LoginIcon/>,
        element: LoginPage
    },
    {
        path: 'admin',
        name: "Admin",
        icon: <AdminPanelSettingsIcon/>,
        element: AdminPage
    },
    {
        path: 'display',
        name: "Display",
        icon: <ConnectedTvIcon/>,
        element: DisplayPage
    }
];
