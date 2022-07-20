import { styled, TextField, Button, Alert } from '@mui/material';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UserContextType } from '../../@types/user';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export interface ILoginProps {}

type Inputs = {
    email: string;
    password: string;
};

const PREFIX = 'Login';

const classes = {
    btnContainer: `${PREFIX}-btnContainer`,
    helper: `${PREFIX}-helper`
};

const Root = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '70%',
    [`& .${classes.btnContainer}`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    [`& .${classes.helper}`]: {
        color: theme.palette.text.primary
    }
}));

export const isValidEmail = (email: string) =>
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

const Login: React.FunctionComponent<ILoginProps> = (props) => {
    const navigate = useNavigate();
    const { login } = React.useContext(AuthContext) as UserContextType;
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<unknown>();

    const handleEmailValidation = (email: string) => {
        const isValid = isValidEmail(email);
        return isValid;
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await login(data);
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage(error);
            setError(true);
        }
    };

    return (
        <Root onSubmit={handleSubmit(onSubmit)}>
            <TextField
                {...register('email', { required: true, validate: handleEmailValidation })}
                defaultValue=""
                helperText={errors.email && 'Vous devez saisir un email valide'}
                FormHelperTextProps={{
                    className: classes.helper
                }}
                color="info"
                type="email"
                label="Email"
                variant="filled"
                required
            />
            <TextField
                {...register('password', { required: true, minLength: 6 })}
                label="Mot de passe"
                type="password"
                color="info"
                helperText={errors.password && 'Vous devez saisir un mot de passe valide avec au moins 6 caractères'}
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
                        setErrorMessage('');
                    }}
                    severity="error"
                >
                    <>
                        Une erreur est survenue, veuillez réessayer.
                        <br />
                        Message: {errorMessage}
                    </>
                </Alert>
            )}
            <div className={classes.btnContainer}>
                <Button variant="contained" color="info" type="submit">
                    Se connecter
                </Button>
            </div>
        </Root>
    );
};

export default Login;
