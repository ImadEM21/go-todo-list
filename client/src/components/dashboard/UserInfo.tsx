import { useContext } from 'react';
import { styled, Grid, useTheme, Typography, IconButton, SvgIconTypeMap } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { useNavigate } from 'react-router-dom';

const PREFIX = 'UserInfo';

const classes = {
    titleContainer: `${PREFIX}-titleContainer`,
    title: `${PREFIX}-title`,
    icon: `${PREFIX}-icon`,
    headerUser: `${PREFIX}-headerUser`
};

const Root = styled(Grid)(({ theme }) => ({
    flex: '0 1 auto',
    borderBottom: `1px solid ${theme.palette.text.primary}`,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    [`& .${classes.titleContainer}`]: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    [`& .${classes.title}`]: {
        fontSize: '16px',
        margin: 0
    },
    [`& .${classes.icon}`]: {
        margin: '.5rem'
    },
    [`& .${classes.headerUser}`]: {
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
        paddingTop: '6px',
        paddingLeft: '1rem',
        paddingRight: '1rem'
    }
}));

export interface IUserInfoProps {
    title: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
        muiName: string;
    };
}

const UserInfo = (props: IUserInfoProps) => {
    const { user } = useContext(AuthContext) as UserContextType;
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Root display="flex" justifyContent="space-between">
            <Grid
                item={true}
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                sx={{
                    [theme.breakpoints.down(1030)]: {
                        width: '100% border-box',
                        justifyContent: 'space-between'
                    }
                }}
            >
                <props.Icon
                    color="info"
                    sx={{
                        [theme.breakpoints.down(1030)]: {
                            display: 'none'
                        }
                    }}
                />
                <Typography
                    variant="h6"
                    gutterBottom={true}
                    component="div"
                    sx={{
                        color: theme.palette.text.primary,
                        paddingTop: '.5rem',
                        marginLeft: '.5rem',
                        [theme.breakpoints.down(500)]: {
                            fontSize: '1rem'
                        }
                    }}
                >
                    {props.title}
                </Typography>
            </Grid>
            <Grid
                item={true}
                className={classes.headerUser}
                sx={{
                    borderRadius: '25px',
                    boxShadow: 3,
                    marginTop: '.5rem',
                    marginBottom: '.5rem',
                    [theme.breakpoints.down(1030)]: {
                        width: '96px',
                        boxShadow: '0'
                    }
                }}
            >
                <Grid item={true} container={true} direction="column" alignItems="flex-end" sx={{ width: '8rem' }}>
                    {user && (
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 'bold',
                                marginBottom: '0',
                                paddingBottom: '0',
                                [theme.breakpoints.down(1030)]: {
                                    display: 'none'
                                }
                            }}
                        >
                            {user.firstName} {user.lastName.toUpperCase()}
                        </Typography>
                    )}
                </Grid>
                <IconButton color="info" onClick={() => navigate('/settings')} aria-describedby={user ? `${user.firstName} ${user.lastName.toUpperCase()}` : 'Utilisateur'}>
                    <AccountCircleIcon fontSize="large" />
                </IconButton>
            </Grid>
        </Root>
    );
};

export default UserInfo;
