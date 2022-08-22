import React, { useContext, useEffect } from 'react';
import { Grid, Typography, styled } from '@mui/material';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import RootHome from './RootHome';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';

export interface IHomeProps {}

export const StyledTypo = styled(Typography)(({ theme }) => ({
    marginTop: '20px',
    marginBottom: '20px',
    color: theme.palette.text.primary,
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    [`&:before`]: {
        content: '""',
        borderTop: `1px solid ${theme.palette.secondary.main}`,
        margin: '0 20px 0 0',
        flex: '1 0 20px'
    },

    [`&:after`]: {
        content: '""',
        borderTop: `1px solid ${theme.palette.secondary.main}`,
        margin: '0 0 0 20px',
        flex: '1 0 20px'
    }
}));

const Home: React.FC<IHomeProps> = (props) => {
    const { user } = useContext(AuthContext) as UserContextType;
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [navigate, user]);

    return (
        <RootHome>
            <StyledTypo variant="h5" align="center">
                J’ai déjà un compte
            </StyledTypo>

            <Login />

            <StyledTypo variant="h5" align="center">
                Je souhaite créer un compte
            </StyledTypo>
            <Grid container={true} direction="row" justifyContent="space-around" alignItems="center">
                <Signup />
            </Grid>
        </RootHome>
    );
};

export default Home;
