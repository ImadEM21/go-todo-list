import { useState, useContext } from 'react';
import { styled, Grid, Snackbar, useMediaQuery } from '@mui/material';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { useNavigate, useLocation } from 'react-router-dom';
import PasswordInput from '../ui/PasswordInput';
import Alert from '../ui/Alert';

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
    const isMobile = useMediaQuery('(max-width: 900px)');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const formSchema = Yup.object().shape({
        password: Yup.string().required('Le mot de passe est obligatoire').min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
        confirmPassword: Yup.string()
            .required('Le mot de passe est obligatoire')
            .oneOf([Yup.ref('password')], 'Les mots de passe ne sont pas identiques')
    });
    const methods = useForm<Inputs>({ mode: 'onBlur', resolver: yupResolver(formSchema) });

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
            <FormProvider {...methods}>
                <Form onSubmit={methods.handleSubmit(onSubmit)}>
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
                            <PasswordInput
                                name="password"
                                color="info"
                                defaultValue=""
                                error={methods.formState.errors.password !== undefined}
                                errorMessage={methods.formState.errors.password?.message}
                                fullWidth
                                id="new-password"
                                label="Nouveau mot de passe"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} paddingLeft={isMobile ? '' : '.5rem'}>
                            <PasswordInput
                                name="confirmPassword"
                                color="info"
                                defaultValue=""
                                error={methods.formState.errors.confirmPassword !== undefined}
                                errorMessage={methods.formState.errors.confirmPassword?.message}
                                fullWidth
                                id="confirm-new-password"
                                label="Confirmez le nouveau mot de passe"
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="end">
                        <LoadingButton loading={loading} type="submit" loadingPosition="start" startIcon={<SaveIcon />} variant="contained" color="info">
                            Enregistrer le nouveau mot de passe
                        </LoadingButton>
                    </Grid>
                </Form>
            </FormProvider>
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
