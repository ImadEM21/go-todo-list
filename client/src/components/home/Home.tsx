import React, { useState } from 'react';
import { Grid, Typography, Box, Avatar, styled, Button } from '@mui/material';
import Login from '../auth/Login';
import Signup from '../auth/Signup';

export interface IHomeProps {}

const PREFIX = 'Home';

const classes = {
    root: `${PREFIX}-root`,
    left: `${PREFIX}-left`,
    right: `${PREFIX}-right`,
    logo: `${PREFIX}-logo`,
    field: `${PREFIX}-field`,
    paper: `${PREFIX}-paper`,
    form: `${PREFIX}-form`,
    fieldForm: `${PREFIX}-fieldForm`,
    label: `${PREFIX}-label`,
    title: `${PREFIX}-title`
};

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.root}`]: {
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        height: '100vh',
        minHeight: '100vh'
    },

    [`& .${classes.left}`]: {
        backgroundColor: theme.palette.secondary.main,
        width: '50vw',
        paddingTop: '10%'
    },

    [`& .${classes.right}`]: {
        width: '50vw',
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
    },

    [`& .${classes.field}`]: {
        marginTop: '1.5rem',
        marginBottom: '1.5rem'
    },

    [`& .${classes.paper}`]: {
        position: 'absolute',
        width: 700,
        height: 500,
        overflow: 'auto',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: '100px 100px'
    },

    // form
    [`& .${classes.form}`]: {
        marginTop: 600
    },

    [`& .${classes.label}`]: {
        backgroundColor: 'white',
        paddingRight: '.5rem',
        paddingLeft: '.5rem'
    },

    [`& .${classes.fieldForm}`]: {
        marginTop: 20,
        marginBottom: 20,
        paddingTop: 15,
        display: 'block',
        '& .MuiFormLabel-root.Mui-disabled': {
            color: 'black'
        }
    },

    [`& .${classes.title}`]: {
        marginTop: '20px',
        marginBottom: '20px',
        color: theme.palette.text.primary,
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },

    [`& .${classes.title}:before`]: {
        content: '""',
        borderTop: `1px solid ${theme.palette.secondary.main}`,
        margin: '0 20px 0 0',
        flex: '1 0 20px'
    },

    [`& .${classes.title}:after`]: {
        content: '""',
        borderTop: `1px solid ${theme.palette.secondary.main}`,
        margin: '0 0 0 20px',
        flex: '1 0 20px'
    }
}));

const Home: React.FC<IHomeProps> = (props) => {
    return (
        <Root>
            <Grid className={classes.root}>
                <Grid item={true} container={true} justifyContent="center" className={classes.left}>
                    <Box
                        component="img"
                        sx={{
                            height: 400,
                            width: 400
                        }}
                        alt="Une illustration des tâches completées"
                        src="/images/todo_illiustration.svg"
                    />
                </Grid>
                <Grid item={true} container={true} direction="column" justifyContent="center" alignItems="center" className={classes.right}>
                    <Avatar variant="square" alt="logo mmie" src="/images/logo_size.jpg" className={classes.logo} />

                    <Typography variant="h5" component="h2" align="center" className={classes.title}>
                        J’ai déjà un compte
                    </Typography>

                    <Login />

                    <Typography variant="h5" component="h2" align="center" className={classes.title}>
                        Je souhaite créer un compte
                    </Typography>
                    <Grid container={true} direction="row" justifyContent="space-around" alignItems="center">
                        <Signup />
                    </Grid>
                </Grid>
            </Grid>
        </Root>
    );
};

export default Home;
