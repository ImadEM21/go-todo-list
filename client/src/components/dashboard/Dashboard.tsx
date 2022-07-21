import { useContext } from 'react';
import Sidebar from './sidebar/Sidebar';
import UserInfo from './UserInfo';
import { styled, Grid, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { capitalizeFirstLetter } from '../../utils/funcs';
import Graph from './graphs/Graph';

const Root = styled(Grid)(({ theme }) => ({
    minHeight: '100vh',
    height: '100vh',
    backgroundColor: theme.palette.primary.main,
    overflowY: 'scroll'
}));

const RightSection = styled(Grid)({
    width: '100%',
    display: 'flex',
    flexFlow: 'column',
    height: '100%'
});

const Content = styled(Grid)({
    padding: '1rem',
    paddingTop: '1.5rem',
    flex: '1 1 auto',
    overflowY: 'scroll'
});

export interface IDashboardProps {}

const Dashboard = (props: IDashboardProps) => {
    const { user } = useContext(AuthContext) as UserContextType;
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Root container={true}>
            <Grid item={true} xs={1.5} md={2}>
                <Sidebar />
            </Grid>
            <RightSection item={true} xs={10.5} md={10}>
                <UserInfo title="TABLEAU DE BORD" Icon={DashboardIcon} />
                <Content display="flex" flexDirection="column" gap="1rem">
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
                </Content>
            </RightSection>
        </Root>
    );
};

export default Dashboard;
