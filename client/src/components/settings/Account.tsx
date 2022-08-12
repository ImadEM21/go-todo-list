import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { styled, Grid, TextField, Snackbar, useMediaQuery } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { isValidEmail, isValidName } from '../../utils/funcs';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '../ui/Alert';

export interface IAccountProps {}

type Inputs = {
    firstName: string;
    lastName: string;
    email: string;
};

const PREFIX = 'Account';

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

const Account = (props: IAccountProps) => {
    const { user, updateUser } = useContext(AuthContext) as UserContextType;
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery('(max-width: 900px)');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    if (!user) {
        navigate('/', { state: { from: location } });
    }
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>({ mode: 'onBlur', defaultValues: { firstName: user?.firstName, lastName: user?.lastName, email: user?.email } });

    const onSubmit = async (data: Inputs) => {
        setLoading(true);
        if (!user) {
            navigate('/', { state: { from: location } });
            return;
        }
        try {
            await updateUser(data, user?._id);
            setSuccess(true);
        } catch (error) {
            console.error({ error });
            setError(true);
        } finally {
            setLoading(false);
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
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            paddingRight: isMobile ? '' : '.5rem',
                            marginBottom: isMobile ? '2rem' : ''
                        }}
                    >
                        <TextField
                            {...register('firstName', {
                                required: { value: true, message: 'Le prénom est obligatoire' },
                                validate: isValidName || 'Le prénom contient des caractères spéciaux non autorisés'
                            })}
                            helperText={errors.firstName && errors.firstName?.message}
                            FormHelperTextProps={{
                                className: classes.helper
                            }}
                            fullWidth
                            label="Prénom"
                            type="text"
                            color="info"
                            variant="filled"
                            required
                            defaultValue={user?.firstName}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} paddingLeft={isMobile ? '' : '.5rem'}>
                        <TextField
                            {...register('lastName', {
                                required: { value: true, message: 'Le nom est obligatoire' },
                                validate: (value) => isValidName(value) || 'Le nom contient des caractères spéciaux non autorisés'
                            })}
                            helperText={errors.lastName && errors.lastName?.message}
                            FormHelperTextProps={{
                                className: classes.helper
                            }}
                            label="Nom"
                            type="text"
                            color="info"
                            variant="filled"
                            required
                            fullWidth
                            defaultValue={user?.lastName}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        {...register('email', { required: { value: true, message: "L'email est obligatoire" }, validate: isValidEmail || 'Vous devez saisir un email valide' })}
                        defaultValue={user?.email}
                        helperText={errors.email && errors.email?.message}
                        FormHelperTextProps={{
                            className: classes.helper
                        }}
                        color="info"
                        type="email"
                        label="Email"
                        variant="filled"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="end">
                    <LoadingButton loading={loading} type="submit" loadingPosition="start" startIcon={<SaveIcon />} variant="contained" color="info">
                        Enregistrer les modifications
                    </LoadingButton>
                </Grid>
            </Form>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Vos informations ont bient été mises à jour.
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

export default Account;
