import { ReactNode, useState, forwardRef } from 'react';
import { ITodo } from '../../@types/todo';
import { ListItemButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, useTheme, useMediaQuery, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

export const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export interface IDetailsProps {
    todo: ITodo;
    children: ReactNode;
}

const Details = ({ todo, children }: IDetailsProps) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <ListItemButton role={undefined} onClick={handleClickOpen} dense>
                {children}
            </ListItemButton>

            <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="details-todo" scroll="paper" TransitionComponent={Transition}>
                <DialogTitle id={`details-todo-${todo._id}`}>{todo.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Disagree
                    </Button>
                    <Button onClick={handleClose} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Details;
