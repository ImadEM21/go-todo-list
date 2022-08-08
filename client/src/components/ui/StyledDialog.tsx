import * as React from 'react';
import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import Transition from './Transition';

export interface IStyledDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
    labelledby: string;
}

const StyledDialog = ({ open, setOpen, children, labelledby }: IStyledDialogProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog fullScreen={fullScreen} maxWidth="md" open={open} onClose={handleClose} aria-labelledby={labelledby} scroll="paper" TransitionComponent={Transition}>
            {children}
        </Dialog>
    );
};

export default StyledDialog;
