import { useState, useContext } from 'react';
import { styled, Grid, Avatar, Snackbar } from '@mui/material';
import DropImage from '../ui/DropImage';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { useNavigate, useLocation } from 'react-router-dom';
import Alert from '../ui/Alert';
import DeleteIcon from '@mui/icons-material/Delete';

const PREFIX = 'UserAvatar';

const classes = {
    helper: `${PREFIX}-helper`
};

const Form = styled('form')(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    marginTop: '2rem',
    marginBottom: '2rem',
    [`&. ${classes.helper}`]: {
        color: theme.palette.text.primary
    }
}));

export interface CustomFile extends File {
    preview: string;
}

export interface IUserAvatarProps {}

const UserAvatar = (props: IUserAvatarProps) => {
    const { user, updateAvatar, deleteAvatar } = useContext(AuthContext) as UserContextType;
    const location = useLocation();
    const navigate = useNavigate();
    const [files, setFiles] = useState<CustomFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (!user) {
            navigate('/', { state: { from: location } });
            return;
        }
        try {
            const blobFile = files[0];
            const file = new File([blobFile], blobFile.name, { lastModified: blobFile.lastModified, type: blobFile.type });
            const payload = new FormData();
            payload.append('avatar', file);
            const success = await updateAvatar(payload, user?._id);
            if (success) {
                setSuccess(true);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error(error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAvatar = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setLoadingDelete(true);
        if (!user) {
            navigate('/', { state: { from: location } });
            return;
        }
        try {
            const success = await deleteAvatar(user._id);
            if (success) {
                setSuccess(true);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error(error);
            setError(true);
        } finally {
            setLoadingDelete(false);
        }
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

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Grid item xs={12}>
                    <DropImage
                        files={files}
                        setFiles={setFiles}
                        id="user-avatar"
                        name="user-avatar"
                        placeholder="Glisser et déposer une image ou cliquer pour selectionner une image (formats acceptés: .jpeg et .png)"
                    />
                    {!files[0] && user?.avatar && <Avatar alt={`${user.firstName} ${user.lastName}`} src={user.avatar} sx={{ width: 192, height: 192, mx: 'auto', mt: '1rem' }} />}
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="end" gap="2rem">
                    {user?.avatar && (
                        <LoadingButton loading={loadingDelete} type="button" onClick={handleDeleteAvatar} loadingPosition="start" startIcon={<DeleteIcon />} variant="contained" color="error">
                            Supprimer mon avatar
                        </LoadingButton>
                    )}
                    <LoadingButton loading={loading} disabled={files.length < 1} type="submit" loadingPosition="start" startIcon={<SaveIcon />} variant="contained" color="info">
                        Enregistrer mon avatar
                    </LoadingButton>
                </Grid>
            </Form>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Votre avatar a bien été mis à jour.
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

export default UserAvatar;
