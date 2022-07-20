import Sidebar from './sidebar/Sidebar';
import UserInfo from './UserInfo';
import { styled, Grid, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';

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
    const navigate = useNavigate();

    return (
        <Root container={true}>
            <Grid item={true} xs={1.5} md={2}>
                <Sidebar />
            </Grid>
            <RightSection item={true} xs={10.5} md={10}>
                <UserInfo title="TABLEAU DE BORD" Icon={DashboardIcon} />
                <Content display="flex">
                    <Grid item={true} xs={7.5}>
                        <Grid container={true} direction="row" justifyContent="flex-start" marginBottom="1rem" gap="2rem">
                            <Grid
                                item={true}
                                xs={3.5}
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                                sx={{
                                    backgroundColor: '#ECECEC',
                                    borderRadius: '15px',
                                    padding: '2rem',
                                    height: 'auto'
                                }}
                            >
                                <Typography variant="h6" component="div" sx={{ lineHeight: '1.2rem' }}>
                                    <span className="redSpan">9</span> comptes référents en attente de validation
                                </Typography>
                                <Grid container={true} direction="row" sx={{ marginTop: '1.5rem' }}>
                                    <Button
                                        variant="contained"
                                        sx={{ padding: '0.2rem 2rem' }}
                                        onClick={() => {
                                            navigate('/admin-referents');
                                        }}
                                    >
                                        Voir plus
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid
                                item={true}
                                xs={3.5}
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                                sx={{
                                    backgroundColor: '#ECECEC',
                                    borderRadius: '15px',
                                    padding: '2rem',
                                    height: 'auto'
                                }}
                            >
                                <Typography variant="h6" component="div" sx={{ lineHeight: '1.2rem' }}>
                                    <span className="redSpan">10 </span> offres en attente d’approbation
                                </Typography>
                                <Grid container={true} direction="row" sx={{ marginTop: '1.5rem' }}>
                                    <Button
                                        variant="contained"
                                        sx={{ padding: '0.2rem 2rem' }}
                                        onClick={() => {
                                            navigate('/dashboard-jobs');
                                        }}
                                    >
                                        Voir plus
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Typography variant="h6" component="div" color="primary" sx={{ marginBottom: '1rem' }}>
                            Événements à venir
                        </Typography>
                        <Grid container={true} direction="column" gap="1rem">
                            k
                        </Grid>
                    </Grid>
                    <Grid item={true} xs={0.5} />
                    <Grid item={true} xs={4} justifyItems="center">
                        <Grid sx={{ marginBottom: '.3rem' }} container={true} direction="column" justifyContent="center" alignItems="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth={true}
                                onClick={() => navigate('/job-offers')}
                                sx={{
                                    borderRadius: '5px',
                                    margin: '0 auto',
                                    marginBottom: '1rem'
                                }}
                            >
                                Créer une offre
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth={true}
                                onClick={() => navigate('/create-event')}
                                sx={{
                                    borderRadius: '5px',
                                    margin: '0 auto',
                                    marginBottom: '1rem'
                                }}
                            >
                                Créer un événement
                            </Button>
                        </Grid>
                    </Grid>
                </Content>
            </RightSection>
        </Root>
    );
};

export default Dashboard;
