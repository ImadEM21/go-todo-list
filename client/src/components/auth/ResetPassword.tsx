import React, { useState } from 'react';
import { styled, DialogTitle, DialogActions, CircularProgress, DialogContent, DialogContentText, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import tokensApi from '../../api/token';
import { isValidEmail } from '../../utils/funcs';
import axios from 'axios';
import Alert from '../ui/Alert';
import StyledDialog from '../ui/StyledDialog';

export interface IResetPasswordProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type Inputs = {
    email: string;
};

const PREFIX = 'ResetPassword';

const classes = {
    helper: `${PREFIX}-helper`
};

const Form = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    [`& .${classes.helper}`]: {
        color: theme.palette.text.primary
    }
}));

const ResetPassword = ({ open, setOpen }: IResetPasswordProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>({ mode: 'onBlur', defaultValues: { email: '' } });

    const onSubmit = (data: Inputs) => {
        setLoading(true);
        if (!isValidEmail(data.email)) {
            setLoading(false);
            return;
        }
        tokensApi
            .createToken(data)
            .then(() => {
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
        <StyledDialog open={open} setOpen={setOpen} labelledby="reset-password">
            <DialogTitle id="reset-password-title">Réinitialisez votre mot de passe</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <DialogContentText>
                            Vous êtes sur le point de réinitialiser votre mot de passe. Vous receverez un email avec un lien permettant de réinitialiser votre mot de passe.
                        </DialogContentText>
                        <Form onSubmit={handleSubmit(onSubmit)} id="new-todo">
                            <TextField
                                {...register('email', { required: true })}
                                helperText={errors.email && "L'email est obligatoire"}
                                label="Entrez votre email"
                                type="email"
                                color="info"
                                variant="filled"
                                required
                                FormHelperTextProps={{
                                    className: classes.helper
                                }}
                            />
                        </Form>
                    </>
                )}
            </DialogContent>
            {!loading && (
                <DialogActions>
                    {error && (
                        <Alert severity="error" onClose={() => setError(false)} sx={{ mx: 4 }}>
                            Un problème est survenu, veuillez réessayer
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" onClose={() => setSuccess(false)} sx={{ mx: 4 }}>
                            Un email vous a été envoyé pour réinitialiser votre mot de passe.
                        </Alert>
                    )}
                    <Button autoFocus color="info" onClick={() => setOpen(false)}>
                        Annuler
                    </Button>
                    <Button type="submit" form="new-todo" color="info" autoFocus>
                        Valider
                    </Button>
                </DialogActions>
            )}
        </StyledDialog>
    );
};

export default ResetPassword;
