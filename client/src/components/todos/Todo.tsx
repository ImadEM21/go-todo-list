import React, { useContext, useState } from 'react';
import { ITodo } from '../../@types/todo';
import { ListItem, ListItemIcon, ListItemText, Checkbox, Chip, Snackbar, CircularProgress } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Details from './Details';
import Delete from './Delete';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType } from '../../@types/todo';
import { UserContextType } from '../../@types/user';
import { AuthContext } from '../contexts/AuthContext';
import { datesAreOnSameDay } from '../../utils/funcs';

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface ITodoProps {
    todo: ITodo;
}

export interface Status {
    label: string;
    color: 'default' | 'error' | 'warning' | 'success' | 'primary' | 'info' | 'secondary' | undefined;
}

const Todo = ({ todo }: ITodoProps) => {
    const { completeTodo } = useContext(TodoContext) as TodoContextType;
    const { user } = useContext(AuthContext) as UserContextType;
    const labelId = `checkbox-list-label-${todo._id}`;
    const getStatusTodo = (): Status => {
        let today = new Date();
        let todoDate = new Date(todo.endDate);
        if (todoDate.getTime() <= today.getTime() && !todo.completed) {
            return {
                label: 'En retard',
                color: 'error'
            };
        }
        if (datesAreOnSameDay(today, todoDate) && !todo.completed) {
            return {
                label: 'Dernier jour',
                color: 'warning'
            };
        }
        if (!todo.completed) {
            return {
                label: 'Dans les temps',
                color: 'primary'
            };
        }
        return {
            label: 'OK',
            color: 'success'
        };
    };
    const status: Status = getStatusTodo();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setError(false);
    };

    const handleComplete = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        setLoading(true);
        try {
            if (!user) throw new Error('Vous devez être connecté pour réaliser cette opération');
            const res = await completeTodo(todo._id, { completed: !todo.completed }, user?._id);
            if (res.nModified > 0) setOpen(true);
        } catch (error) {
            console.error({ error });
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ListItem secondaryAction={<Delete todo={todo} />} disablePadding>
                <Details todo={todo}>
                    <ListItemIcon onClick={handleComplete}>
                        {loading ? (
                            <CircularProgress color="info" />
                        ) : (
                            <Checkbox edge="start" checked={todo.completed} tabIndex={-1} color="info" disableRipple inputProps={{ 'aria-labelledby': labelId }} />
                        )}
                    </ListItemIcon>
                    <ListItemText id={`title-${todo._id}`} primary={todo.title} />
                    <ListItemText id={`endDate-${todo._id}`} primary={new Date(todo.endDate).toLocaleDateString()} />
                    <ListItemText id={`status-${todo._id}`} primary={<Chip label={status.label} color={status.color} />} />
                </Details>
            </ListItem>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Le todo a été mise à jour avec succès
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    Un problème est survenu, veuillez réessayer.
                </Alert>
            </Snackbar>
        </>
    );
};

export default Todo;
