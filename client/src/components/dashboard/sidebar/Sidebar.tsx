import { styled, Grid, useTheme, Avatar, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RenderRoute from './RenderRoute';
import { MAIN_ROUTES, SECONDARY_ROUTES } from './routes';

const SideBarBody = styled(Grid)(({ theme }) => ({
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.secondary.main,
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
}));

export interface ISidebarProps {}

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
