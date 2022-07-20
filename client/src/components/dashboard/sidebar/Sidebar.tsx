import { styled, Grid, useTheme, Avatar, useMediaQuery, SvgIconTypeMap } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import RenderRoute from './RenderRoute';

const SideBarBody = styled(Grid)(({ theme }) => ({
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.secondary.main,
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
}));

export interface ISidebarProps {}

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

const MAIN_ROUTES: IRoute[] = [
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
    },
    {
        id: 4,
        label: 'SUPPORT',
        path: '/support',
        slash: false,
        Icon: ContactSupportIcon,
        isLogout: false
    }
];

const SECONDARY_ROUTES: IRoute[] = [
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

const Sidebar = (props: ISidebarProps) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width: 900px)');

    return (
        <SideBarBody container={true} direction="column" justifyContent="space-between" alignItems="center">
            <Grid
                sx={{
                    [theme.breakpoints.down(500)]: {
                        paddingLeft: '0',
                        paddingRight: '0',
                        width: '100%'
                    }
                }}
            >
                <Grid
                    sx={{
                        paddingLeft: '1rem',
                        paddingRight: '1rem',
                        marginTop: '2rem',
                        [theme.breakpoints.down(500)]: {
                            paddingLeft: '0',
                            paddingRight: '0',
                            width: '100% border-box',
                            height: 'auto'
                        }
                    }}
                >
                    <Avatar
                        alt="TODO"
                        variant="square"
                        src="/images/logo_size.jpg"
                        sx={
                            isMobile
                                ? { alignItems: 'center', width: '100%', height: '3rem', marginBottom: '1rem', cursor: 'pointer', paddingLeft: '0', paddingRight: '0' }
                                : {
                                      display: 'flex',
                                      alignItems: 'center',
                                      marginBottom: '2rem',
                                      cursor: 'pointer',
                                      width: 'auto',
                                      height: 'auto'
                                  }
                        }
                        onClick={() => {
                            navigate('/');
                        }}
                    />
                </Grid>
                <Grid
                    container={true}
                    className="menu"
                    sx={{
                        width: '100%',
                        paddingLeft: '1rem',
                        [theme.breakpoints.down(500)]: {
                            paddingLeft: '0',
                            paddingRight: '0',
                            marginLeft: '0',
                            overflow: 'hidden',
                            marginRight: '0',
                            width: '50% border-box'
                        }
                    }}
                >
                    {MAIN_ROUTES.map((route) => (
                        <RenderRoute route={route} key={route.id} />
                    ))}
                </Grid>
            </Grid>
            <Grid
                className="menu"
                sx={{
                    width: '100%',
                    paddingLeft: '1rem',
                    marginBottom: '1rem',
                    [theme.breakpoints.down(500)]: {
                        width: '100%',
                        paddingLeft: '0',
                        overflow: 'hidden'
                    }
                }}
                container={true}
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
            >
                {SECONDARY_ROUTES.map((route) => (
                    <RenderRoute route={route} key={route.id} />
                ))}
            </Grid>
        </SideBarBody>
    );
};

export default Sidebar;
