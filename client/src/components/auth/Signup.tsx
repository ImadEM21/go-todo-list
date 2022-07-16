import React, { useState } from 'react';
import { Button, Modal, Box, Typography, styled, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { isValidEmail } from './Login';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export interface ISignupProps {}

type Inputs = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPwd: string;
};

const styles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    maxWidth: '90%',
    height: 'auto',
    maxHeight: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

const PREFIX = 'Signup';

const classes = {
    container: `${PREFIX}-container`,
    title: `${PREFIX}-title`,
    btnContainer: `${PREFIX}-btnContainer`,
    helper: `${PREFIX}-helper`
};

const StyledModal = styled(Modal)(({ theme }) => ({
    [`& .${classes.title}`]: {
        marginTop: '20px',
        marginBottom: '20px',
        color: theme.palette.text.primary,
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },

    [`& .${classes.title}:before`]: {
        content: '""',
        borderTop: `1px solid ${theme.palette.secondary.main}`,
        margin: '0 20px 0 0',
        flex: '1 0 20px'
    },

    [`& .${classes.title}:after`]: {
        content: '""',
        borderTop: `1px solid ${theme.palette.secondary.main}`,
        margin: '0 0 0 20px',
        flex: '1 0 20px'
    }
}));

const Form = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '70%',
    [`& .${classes.btnContainer}`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    [`& .${classes.helper}`]: {
        color: theme.palette.text.primary
    }
}));

const Signup: React.FC<ISignupProps> = (props) => {
    const formSchema = Yup.object().shape({
        password: Yup.string().required('Le mot de passe est obligatoire').min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
        confirmPwd: Yup.string()
            .required('Le mot de passe est obligatoire')
            .oneOf([Yup.ref('password')], 'Les mots de passe ne sont pas identiques')
    });
    const formOptions = { resolver: yupResolver(formSchema) };
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>(formOptions);
    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleEmailValidation = (email: string) => {
        const isValid = isValidEmail(email);
        return isValid;
    };

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
    };

    return (
        <>
            <Button variant="contained" color="info" type="button" onClick={handleOpen}>
                Je me créer mon compte
            </Button>
            <StyledModal open={open} onClose={handleClose} aria-labelledby="Se créer un compte" aria-describedby="Remplir le formulaire pour se créer un compte">
                <Box sx={styles}>
                    <Typography variant="h4" component="h2" align="center" className={classes.title}>
                        Se créer un compte
                    </Typography>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <TextField {...register('firstName', { required: true })} label="Prénom" type="text" color="info" variant="filled" required />
                        <TextField {...register('lastName', { required: true })} label="Nom" type="text" color="info" variant="filled" required />
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
                            helperText={errors.password && errors.password?.message}
                            FormHelperTextProps={{
                                className: classes.helper
                            }}
                            variant="filled"
                            required
                        />
                        <TextField
                            {...register('confirmPwd', { required: true, minLength: 6 })}
                            label="Confirmez le mot de passe"
                            type="password"
                            color="info"
                            helperText={errors.password && errors.confirmPwd?.message}
                            FormHelperTextProps={{
                                className: classes.helper
                            }}
                            variant="filled"
                            required
                        />
                        <div className={classes.btnContainer}>
                            <Button variant="contained" color="info" type="reset">
                                RÉINITIALISER
                            </Button>
                            <Button variant="contained" color="info" type="submit">
                                VALIDER
                            </Button>
                        </div>
                    </Form>
                </Box>
            </StyledModal>
        </>
    );
};

export default Signup;
