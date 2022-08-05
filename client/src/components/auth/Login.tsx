import { styled, TextField, Button, Alert } from '@mui/material';
import React, { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UserContextType } from '../../@types/user';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType } from '../../@types/todo';
import { isValidEmail } from '../../utils/funcs';
import ResetPasswordButton from './ResetPasswordButton';

export interface ILoginProps {}

type Inputs = {
    email: string;
    password: string;
};

export interface LocationState {
    from: { pathname: string };
}

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
        flexDirection: 'column',
        gap: '.5rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    [`& .${classes.helper}`]: {
        color: theme.palette.text.primary
    }
}));

const Login: React.FunctionComponent<ILoginProps> = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { from } = (location?.state as LocationState) || { pathname: '/dashboard' };
    const { login } = React.useContext(AuthContext) as UserContextType;
    const { getTodos } = useContext(TodoContext) as TodoContextType;
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<unknown>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const user = await login(data);
            await getTodos(user._id);
            navigate(from ? from.pathname : '/dashboard');
        } catch (error) {
            setErrorMessage(error);
            setError(true);
        }
    };

    return (
        <Root onSubmit={handleSubmit(onSubmit)}>
            {from && from?.pathname ? <Alert severity="warning">Veuillez vous connecter pour accèder à cette page</Alert> : null}
            <TextField
                {...register('email', { required: true, validate: isValidEmail })}
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
                <ResetPasswordButton />
                <Button variant="contained" color="info" type="submit">
                    Se connecter
                </Button>
            </div>
        </Root>
    );
};

export default Login;
