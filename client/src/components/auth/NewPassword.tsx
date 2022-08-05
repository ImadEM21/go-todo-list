import { useState } from 'react';
import { useParams } from 'react-router-dom';
import RootHome from '../home/RootHome';
import { StyledTypo } from '../home/Home';
import { useForm, SubmitHandler } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { styled, TextField, Typography } from '@mui/material';
import tokensApi from '../../api/token';
import axios from 'axios';
import { Alert } from '../todos/TodoCell';
import SaveIcon from '@mui/icons-material/Save';

type Inputs = {
    password: string;
    confirmPassword: string;
};

export interface INewPasswordProps {}

const PREFIX = 'NewPassword';

const classes = {
    btnContainer: `${PREFIX}-btnContainer`,
    helper: `${PREFIX}-helper`
};

const Form = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '70%',
    [`& .${classes.btnContainer}`]: {
        display: 'flex',
        flexDirection: 'column',
        gap: '.5rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    [`& .${classes.helper}`]: {
        color: theme.palette.text.primary
    }
}));

const NewPassword = (props: INewPasswordProps) => {
    const { userId, token } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [invalid, setInvalid] = useState(false);
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

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setLoading(true);
        if (!userId || !token) {
            setInvalid(true);
            setLoading(false);
            return;
        }
        tokensApi
            .resetPassword(userId, token, { password: data.password })
            .then((res) => {
                setSuccess(true);
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    console.error(error.response);
                    setError(true);
                    return;
                }
                console.error({ error });
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <RootHome>
            <StyledTypo variant="h5" align="center">
                Réinitialiser mon mot de passe
            </StyledTypo>
            {invalid ? (
                <Typography variant="h3">Le lien n'est pas valide, veuillez renvoyer le formulaire de réinitialisation de mot de passe</Typography>
            ) : (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        {...register('password', { required: true, minLength: 6 })}
                        label="Nouveau mot de passe"
                        type="password"
                        color="info"
                        helperText={errors.password && errors.password?.message}
                        FormHelperTextProps={{
                            className: classes.helper
                        }}
                        variant="filled"
                        required
                    />
                    <TextField
                        {...register('confirmPassword', { required: true, minLength: 6 })}
                        label="Confirmez le nouveau mot de passe"
                        type="password"
                        color="info"
                        helperText={errors.confirmPassword && errors.confirmPassword?.message}
                        FormHelperTextProps={{
                            className: classes.helper
                        }}
                        variant="filled"
                        required
                    />
                    {error && (
                        <Alert
                            onClose={() => {
                                setError(false);
                            }}
                            severity="error"
                        >
                            Une erreur est survenue, veuillez réessayer.
                        </Alert>
                    )}
                    {success && (
                        <Alert
                            onClose={() => {
                                setSuccess(false);
                            }}
                            severity="success"
                        >
                            Votre mot de passe a bien été mis à jour.
                        </Alert>
                    )}
                    <div className={classes.btnContainer}>
                        <LoadingButton loading={loading} loadingPosition="start" startIcon={<SaveIcon />} variant="contained" color="info" type="submit">
                            Valider le nouveau mot de passe
                        </LoadingButton>
                    </div>
                </Form>
            )}
        </RootHome>
    );
};

export default NewPassword;
