import DashWrapper from '../dashboard/DashWrapper';
import { Typography, Grid, useTheme, Divider, useMediaQuery } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Account from './Account';
import Password from './Password';
import DeleteAccount from './DeleteAccount';

export interface ISettingsProps {}

const Settings = (props: ISettingsProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width: 900px)');
    return (
        <DashWrapper Icon={SettingsIcon} title="PARAMÈTRES">
            <Grid item xs={12} display="flex" flexDirection="column">
                <Typography component="h1" variant={isMobile ? 'h4' : 'h3'} sx={{ color: theme.palette.text.primary }}>
                    Mes informations
                </Typography>
                <Account />
                <Divider />
                <Typography component="h1" variant={isMobile ? 'h4' : 'h3'} sx={{ color: theme.palette.text.primary }} mt="2rem">
                    Changer mon mot de passe
                </Typography>
                <Password />
                <Divider />
                <Typography component="h1" variant={isMobile ? 'h4' : 'h3'} sx={{ color: theme.palette.text.primary }} mt="2rem">
                    Supprimer mon compte
                </Typography>
                <DeleteAccount />
            </Grid>
        </DashWrapper>
    );
};

export default Settings;
