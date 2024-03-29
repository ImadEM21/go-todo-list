import { useContext } from 'react';
import { Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { capitalizeFirstLetter } from '../../utils/funcs';
import Graph from './graphs/Graph';
import DashWrapper from './DashWrapper';

export interface IDashboardProps {}

const Dashboard = (props: IDashboardProps) => {
    const { user } = useContext(AuthContext) as UserContextType;
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width: 900px)');

    return (
        <>
            <DashWrapper title="TABLEAU DE BORD" Icon={DashboardIcon}>
                <Grid item xs={12} display="contents">
                    <Typography component="h1" variant={isMobile ? 'h4' : 'h3'}>
                        Bonjour,{' '}
                        <Typography component="span" variant={isMobile ? 'h4' : 'h3'} fontWeight="800" sx={{ color: theme.palette.text.primary }}>
                            {capitalizeFirstLetter(user ? user.firstName : '')} {user?.lastName.toLocaleUpperCase()}
                        </Typography>
                    </Typography>
                </Grid>
                <Grid item xs={12} display="contents">
                    <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                        Récapitulatif des todos validés les{' '}
                        <Typography variant="h6" component="span" sx={{ color: theme.palette.text.primary }}>
                            7 derniers jours
                        </Typography>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Graph />
                </Grid>
            </DashWrapper>
        </>
    );
};

export default Dashboard;
