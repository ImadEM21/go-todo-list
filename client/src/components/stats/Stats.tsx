import DashWrapper from '../dashboard/DashWrapper';
import { Typography, useTheme } from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

export interface IStatsProps {}

const Stats = (props: IStatsProps) => {
    const theme = useTheme();
    return (
        <DashWrapper Icon={PieChartIcon} title="STATISTIQUES">
            <Typography component="h1" variant="h3" sx={{ color: theme.palette.text.primary }}>
                Cette fonctionnalité sera bientôt disponible...
                <HourglassTopIcon color="info" sx={{ fontSize: 50 }} />
            </Typography>
        </DashWrapper>
    );
};

export default Stats;
