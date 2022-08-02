import { useContext, useEffect, useState } from 'react';
import { Grid, Typography, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { capitalizeFirstLetter } from '../../utils/funcs';
import Graph from './graphs/Graph';
import DashWrapper from './DashWrapper';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType, GraphData } from '../../@types/todo';
import { useNavigate, useLocation } from 'react-router-dom';

export interface IDashboardProps {}

const Dashboard = (props: IDashboardProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext) as UserContextType;
    const { getLastCompleted } = useContext(TodoContext) as TodoContextType;
    const theme = useTheme();
    const [graphData, setGraphData] = useState<GraphData[]>([]);

    useEffect(() => {
        if (!user) {
            navigate('/', { state: { from: location }, replace: true });
            return;
        }
        getLastCompleted(user._id)
            .then((data) => {
                console.log('data: ', data);
            })
            .catch((error) => {
                console.error({ error });
            });
    }, []);

    return (
        <DashWrapper title="TABLEAU DE BORD" Icon={DashboardIcon}>
            <Grid item xs={12} display="contents">
                <Typography component="h1" variant="h3">
                    Bonjour,{' '}
                    <Typography component="span" variant="h3" fontWeight="800" sx={{ color: theme.palette.text.primary }}>
                        {capitalizeFirstLetter(user ? user.firstName : '')} {user?.lastName.toLocaleUpperCase()}
                    </Typography>
                </Typography>
            </Grid>
            <Grid item xs={12} display="contents">
                <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                    Récapitulatif des todo validés les{' '}
                    <Typography variant="h6" component="span" sx={{ color: theme.palette.text.primary }}>
                        7 derniers jours
                    </Typography>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Graph />
            </Grid>
        </DashWrapper>
    );
};

export default Dashboard;
