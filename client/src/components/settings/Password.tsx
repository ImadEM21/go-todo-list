import { useState, useContext } from 'react';
import { styled, Grid, FormControl, InputLabel, FilledInput, InputAdornment, IconButton, FormHelperText, Snackbar } from '@mui/material';
import { Alert } from '../todos/TodoCell';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { useNavigate, useLocation } from 'react-router-dom';

export interface IPasswordProps {}

type Inputs = {
    password: string;
    confirmPassword: string;
};

const PREFIX = 'Password';

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

const Password = (props: IPasswordProps) => {
    const { user, updatePassword } = useContext(AuthContext) as UserContextType;
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const formSchema = Yup.object().shape({
        password: Yup.string().required('Le mot de passe est obligatoire').min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
        confirmPassword: Yup.string()
            .required('Le mot de passe est obligatoire')
            .oneOf([Yup.ref('password')], 'Les mots de passe ne sont pas identiques')
    });
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>({ mode: 'onBlur', resolver: yupResolver(formSchema) });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoading(true);
        if (!user) {
            navigate('/', { state: { from: location } });
            return;
        }
        try {
            const updated = await updatePassword({ password: data.password }, user._id);
            if (updated) {
                setSuccess(true);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error({ error });
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClickConfirmShowPassword = () => {
        setConfirmShowPassword((prev) => !prev);
    };

    const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
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
                <Grid item xs={12} display="flex">
                    <Grid item xs={12} md={6} paddingRight=".5rem">
                        <FormControl fullWidth variant="filled" color="info">
                            <InputLabel htmlFor="password">Nouveau mot de passe</InputLabel>
                            <FilledInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', { required: true, minLength: 6 })}
                                defaultValue=""
                                aria-describedby="password-helper-text"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton aria-label="afficher le mot de passe" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {errors.password && (
                                <FormHelperText className={classes.helper} id="password-helper-text">
                                    {errors.password?.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} paddingLeft=".5rem">
                        <FormControl fullWidth variant="filled" color="info">
                            <InputLabel htmlFor="confirmPassword">Confirmez le nouveau mot de passe</InputLabel>
                            <FilledInput
                                id="confirmPassword"
                                type={confirmShowPassword ? 'text' : 'password'}
                                {...register('confirmPassword', { required: true, minLength: 6 })}
                                defaultValue=""
                                aria-describedby="confirm-password-helper-text"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton aria-label="afficher le mot de passe" onClick={handleClickConfirmShowPassword} onMouseDown={handleMouseDownConfirmPassword} edge="end">
                                            {confirmShowPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {errors.confirmPassword && (
                                <FormHelperText className={classes.helper} id="confirm-password-helper-text">
                                    {errors.confirmPassword?.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="end">
                    <LoadingButton loading={loading} type="submit" loadingPosition="start" startIcon={<SaveIcon />} variant="contained" color="info">
                        Enregistrer le nouveau mot de passe
                    </LoadingButton>
                </Grid>
            </Form>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Votre mot de passe a bien été mis à jour.
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

export default Password;
