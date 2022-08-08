import { useContext, useState } from 'react';
import StyledDialog from '../ui/StyledDialog';
import { Button, DialogActions, DialogTitle, DialogContent, DialogContentText, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { useNavigate, useLocation } from 'react-router-dom';

export interface IDeleteAccountProps {}

const DeleteAccount = (props: IDeleteAccountProps) => {
    const { user, deleteUser, logout } = useContext(AuthContext) as UserContextType;
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOpen(false);
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setLoading(true);
        if (!user) {
            navigate('/', { state: { from: location } });
            return;
        }
        try {
            const res = await deleteUser(user._id);
            if (res.nDeleted > 0) {
                logout();
                navigate('/');
                return;
            } else {
                throw new Error("Le compte n'a pas pu être supprimé");
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
            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '1rem', marginTop: '1rem' }}>
                <Button onClick={() => setOpen(true)} variant="contained" color="info" startIcon={<DeleteIcon />}>
                    Je supprime mon compte
                </Button>
            </div>

            <StyledDialog open={open} setOpen={setOpen} labelledby="delete account">
                <DialogTitle id="delete-account">Êtes vous sûr de vouloir supprimer votre compte</DialogTitle>
                <DialogContent>
                    <DialogContentText>Votre compte sera définitivement supprimé et ne pourra pas être récupré. Toutes vos todos seront également supprimés.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {error && (
                        <Alert severity="error" onClose={() => setError(false)}>
                            Un problème est survenu, veuillez réessayer.
                        </Alert>
                    )}
                    <Button autoFocus disabled={loading} color="info" onClick={handleClose}>
                        Annuler
                    </Button>
                    <LoadingButton loading={loading} onClick={handleDelete} color="info" autoFocus>
                        Supprimer
                    </LoadingButton>
                </DialogActions>
            </StyledDialog>
        </>
    );
};

export default DeleteAccount;
