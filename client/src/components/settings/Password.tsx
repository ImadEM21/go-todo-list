import { useState } from 'react';
import { styled, Grid, TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

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
    const [loading, setLoading] = useState(false);
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
        console.log(data);
        setLoading(false);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12} display="flex">
                <Grid item xs={12} md={6} paddingRight=".5rem">
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
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6} paddingLeft=".5rem">
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
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end">
                <LoadingButton loading={loading} type="submit" loadingPosition="start" startIcon={<SaveIcon />} variant="contained" color="info">
                    Enregistrer le nouveau mot de passe
                </LoadingButton>
            </Grid>
        </Form>
    );
};

export default Password;
