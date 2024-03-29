import { useContext, useState } from 'react';
import { ITodo } from '../../@types/todo';
import { IconButton, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType } from '../../@types/todo';
import Alert from '../ui/Alert';
import StyledDialog from '../ui/StyledDialog';

export interface IDeleteProps {
    todo: ITodo;
}

const Delete = ({ todo }: IDeleteProps) => {
    const { deleteTodo } = useContext(TodoContext) as TodoContextType;
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClickOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
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
            const res = await deleteTodo(todo._id);
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
                <DeleteIcon color="error" />
            </IconButton>

            <StyledDialog open={open} setOpen={setOpen} labelledby="delete-todo">
                <DialogTitle id={`delete-todo-${todo._id}`}>Êtes vous sûr de vouloir supprimer la todo {todo.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>La todo sera définitivement supprimé et ne pourra pas être récuprée. Elle ne sera pas tenu en compte dans les statistiques non plus.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {loading ? (
                        <CircularProgress color="info" />
                    ) : (
                        <>
                            <Button autoFocus color="info" onClick={handleClose}>
                                Annuler
                            </Button>
                            <Button onClick={handleDelete} color="info" autoFocus>
                                Supprimer
                            </Button>
                        </>
                    )}
                </DialogActions>
            </StyledDialog>
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
