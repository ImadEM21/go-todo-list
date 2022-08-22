import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

export interface IRoute {
    id: number;
    label: string;
    path: string;
    slash: boolean;
    Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
        muiName: string;
    };
    isLogout: boolean;
}

export const MAIN_ROUTES: IRoute[] = [
    {
        id: 1,
        label: 'TABLEAU DE BORD',
        path: '/dashboard',
        slash: false,
        Icon: DashboardIcon,
        isLogout: false
    },
    {
        id: 2,
        label: 'MA TODO LIST',
        path: '/todos',
        slash: true,
        Icon: FormatListBulletedIcon,
        isLogout: false
    },
    {
        id: 3,
        label: 'STATISTIQUES',
        path: '/stats',
        slash: false,
        Icon: PieChartIcon,
        isLogout: false
    }
];

export const SECONDARY_ROUTES: IRoute[] = [
    {
        id: 5,
        label: 'PARAMÈTRES',
        path: '/settings',
        slash: false,
        Icon: SettingsIcon,
        isLogout: false
    },
    {
        id: 6,
        label: 'SE DÉCONNECTER',
        path: '/',
        slash: false,
        Icon: ExitToAppIcon,
        isLogout: true
    }
];
