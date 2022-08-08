import { useState, useContext } from 'react';
import { TableCell, CircularProgress, Checkbox, Snackbar, Chip } from '@mui/material';
import { ITodo } from '../../@types/todo';
import Details from './Details';
import Delete from './Delete';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType } from '../../@types/todo';
import { getStatusTodo, Status } from '../../utils/funcs';
import { useTheme } from '@mui/material';
import Alert from '../ui/Alert';

export interface ITodoCellProps {
    todo: ITodo;
}

const TodoCell = ({ todo }: ITodoCellProps) => {
    const { completeTodo } = useContext(TodoContext) as TodoContextType;
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const labelId = `checkbox-list-label-${todo._id}`;
    const status: Status = getStatusTodo(todo);
    const theme = useTheme();

    const handleComplete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setLoading(true);
        try {
            const res = await completeTodo(todo._id, { completed: !todo.completed });
            if (res.nModified > 0) setOpen(true);
        } catch (error) {
            console.error({ error });
            setError(true);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <>
            <Details todo={todo}>
                <TableCell align="center" size="medium">
                    {loading ? (
                        <CircularProgress color="success" />
                    ) : (
                        <>
                            <Checkbox edge="start" onClick={handleComplete} checked={todo.completed} tabIndex={-1} color="success" disableRipple inputProps={{ 'aria-labelledby': labelId }} />
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
                    )}
                </TableCell>
                <TableCell align="center" size="medium" sx={{ color: theme.palette.text.secondary }}>
                    {todo.title}
                </TableCell>
                <TableCell align="center" size="medium" sx={{ color: theme.palette.text.secondary }}>
                    {new Date(todo.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell align="center" size="medium">
                    <Chip label={status.label} color={status.color} />
                </TableCell>
                <TableCell align="center" size="medium" onClick={(e) => e.stopPropagation()}>
                    <Delete todo={todo} />
                </TableCell>
            </Details>
        </>
    );
};

export default TodoCell;
