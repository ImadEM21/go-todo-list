import DeleteIcon from '@mui/icons-material/Delete';
import { ListItem, ListItemText, ListItemIcon, Checkbox, ListItemButton, IconButton, useTheme } from '@mui/material';

export interface IFirstProps {}

const First = ({}: IFirstProps) => {
    const theme = useTheme();
    return (
        <ListItem
            disablePadding
            secondaryAction={
                <IconButton edge="end" sx={{ visibility: 'hidden' }}>
                    <DeleteIcon />
                </IconButton>
            }
        >
            <ListItemButton
                disableTouchRipple
                role={undefined}
                dense
                sx={{ cursor: 'default' }}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <ListItemIcon
                    sx={{ visibility: 'hidden' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <Checkbox disabled tabIndex={-1} defaultChecked={false} disableRipple />
                </ListItemIcon>
                <ListItemText id="title-description" primary="Titre" sx={{ color: theme.palette.text.primary }} />
                <ListItemText id="endDate-description" primary="À finir pour le" sx={{ color: theme.palette.text.primary }} />
                <ListItemText id="status-description" primary="Avancement" sx={{ color: theme.palette.text.primary }} />
            </ListItemButton>
        </ListItem>
    );
};

export default First;
