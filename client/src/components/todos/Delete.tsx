import { useContext, useState } from 'react';
import { ITodo } from '../../@types/todo';
import { IconButton, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Transition } from './DialogDetails';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType } from '../../@types/todo';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { Alert } from './Todo';

export interface IDeleteProps {
    todo: ITodo;
}

const Delete = ({ todo }: IDeleteProps) => {
    const { deleteTodo } = useContext(TodoContext) as TodoContextType;
    const { user } = useContext(AuthContext) as UserContextType;
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setError(false);
    };

    const handleCloseSuccess = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccess(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            if (!user) throw new Error('Vous devez être connecté pour réaliser cette opération');
            const res = await deleteTodo(todo._id, user._id);
            if (res.nDeleted > 0) {
                setSuccess(true);
            }
        } catch (error) {
            console.error({ error });
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <IconButton edge="end" aria-label="delete" onClick={handleClickOpen}>
                <DeleteIcon />
            </IconButton>

            <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="delete-todo" scroll="paper" TransitionComponent={Transition}>
                <DialogTitle id={`delete-todo-${todo._id}`}>Êtes vous sûr de vouloir supprimer la todo {todo.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>La todo sera définitivement supprimé et ne pourra pas être récuprée. Elle ne sera pas tenu en compte dans les statistiques non plus.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {loading ? (
                        <CircularProgress color="info" />
                    ) : (
                        <>
                            <Button autoFocus onClick={handleClose}>
                                Annuler
                            </Button>
                            <Button onClick={handleDelete} autoFocus>
                                Supprimer
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
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

export default Delete;
