import * as React from 'react';
import { styled, Grid, Box, Avatar, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface IRootHomeProps {
    children: React.ReactNode;
}

const PREFIX = 'Home';

const classes = {
    root: `${PREFIX}-root`,
    left: `${PREFIX}-left`,
    right: `${PREFIX}-right`,
    logo: `${PREFIX}-logo`
};

const Root = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100vw',
    height: '100vh',
    minHeight: '100vh',

    [`& .${classes.left}`]: {
        backgroundColor: theme.palette.secondary.main,
        //width: '50vw',
        paddingTop: '10%'
    },

    [`& .${classes.right}`]: {
        //width: '50vw',
        backgroundColor: theme.palette.primary.main
    },

    [`& .${classes.logo}`]: {
        height: 'auto',
        width: 'auto',
        alignSelf: 'center',
        marginBottom: '1.5rem',
        '&:hover': {
            cursor: 'pointer'
        }
    }
}));

const RootHome = ({ children }: IRootHomeProps) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 900px)');
    return (
        <Root container>
            <Grid item display={isMobile ? 'none' : 'flex'} md={6} xs={0} justifyContent="center" className={classes.left}>
                <Box
                    component="img"
                    sx={{
                        height: 400,
                        width: 400
                    }}
                    alt="Une illustration des tâches completées"
                    src="/images/todo_illustration.svg"
                />
            </Grid>
            <Grid item={true} md={6} xs={12} container={true} direction="column" justifyContent="center" alignItems="center" className={classes.right}>
                <Avatar variant="square" alt="TODO" src="/images/logo_size.jpg" onClick={() => navigate('/')} className={classes.logo} />
                {children}
            </Grid>
        </Root>
    );
};

export default RootHome;
