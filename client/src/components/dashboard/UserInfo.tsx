import { useContext } from 'react';
import { styled, Grid, useTheme, Typography, IconButton, SvgIconTypeMap, Avatar } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../utils/funcs';

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
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        backgroundColor: theme.palette.text.secondary,
        borderRadius: '25px',
        boxShadow: 3,
        marginTop: '.5rem',
        marginBottom: '.5rem',
        [theme.breakpoints.down(1030)]: {
            width: '96px',
            boxShadow: '0'
        }
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
            <Grid item className={classes.headerUser}>
                {user && (
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{
                            color: theme.palette.primary.light,
                            fontWeight: 'bold',
                            marginBottom: '0',
                            paddingBottom: '0',
                            [theme.breakpoints.down(1030)]: {
                                display: 'none'
                            }
                        }}
                    >
                        {capitalizeFirstLetter(user.firstName)} {user.lastName.toUpperCase()}
                    </Typography>
                )}
                <IconButton color="info" onClick={() => navigate('/settings')} aria-describedby={user ? `${user.firstName} ${user.lastName.toUpperCase()}` : 'Utilisateur'}>
                    {<Avatar alt={user?.firstName} src={user?.avatar} sx={{ width: 35, height: 35 }} />}
                </IconButton>
            </Grid>
        </Root>
    );
};

export default UserInfo;
