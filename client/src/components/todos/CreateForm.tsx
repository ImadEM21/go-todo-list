import React, { useState, useContext } from 'react';
import { CreateTodo } from '../../@types/todo';
import { DialogTitle, DialogContent, DialogActions, Button, styled, TextField, FormControlLabel, Checkbox, CircularProgress, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import Editor from '../ui/Editor';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/esm/locale/fr/index.js';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType } from '../../@types/todo';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { useNavigate, useLocation } from 'react-router-dom';
import { TodoInputs } from '../../@types/todo';
import StyledDialog from '../ui/StyledDialog';

export interface ICreateFormProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const PREFIX = 'CreateForm';

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

const CreateForm = ({ open, setOpen, setSuccess }: ICreateFormProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { createTodo } = useContext(TodoContext) as TodoContextType;
    const { user } = useContext(AuthContext) as UserContextType;
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TodoInputs>({ mode: 'onBlur', defaultValues: { title: '', completed: false } });
    const [description, setDescription] = useState<string>('');
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const onSubmit = async (data: TodoInputs) => {
        if (!user) {
            navigate('/', { state: { from: location }, replace: true });
            return;
        }
        setLoading(true);
        const payload: CreateTodo = {
            ...data,
            description,
            endDate: endDate ? endDate?.toISOString() : new Date().toISOString(),
            userId: user._id
        };
        payload.completed = /true/i.test(data.completed.toString());
        try {
            await createTodo(payload);
            setOpen(false);
            setSuccess(true);
        } catch (error) {
            console.error({ error });
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (newValue: Date | null) => {
        setEndDate(newValue);
    };

    return (
        <StyledDialog open={open} setOpen={setOpen} labelledby="details-todo">
            <DialogTitle id="details-new-todo">Nouvelle tâche</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Form onSubmit={handleSubmit(onSubmit)} id="new-todo">
                        <TextField
                            {...register('title', { required: true })}
                            helperText={errors.title && 'Le titre est obligatoire'}
                            label="Titre"
                            type="text"
                            color="info"
                            variant="filled"
                            required
                            FormHelperTextProps={{
                                className: classes.helper
                            }}
                        />
                        <div style={{ minWidth: '600px' }}>
                            <Editor description={description} setDescription={setDescription} />
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                            <MobileDatePicker
                                label="Date de fin"
                                inputFormat="dd/MM/yyyy"
                                value={endDate}
                                onChange={handleChange}
                                renderInput={(params) => <TextField {...params} variant="filled" color="info" required />}
                            />
                        </LocalizationProvider>
                        <FormControlLabel label="Tâche terminée" control={<Checkbox {...register('completed')} defaultChecked={false} color="info" />} />
                    </Form>
                )}
            </DialogContent>
            {!loading && (
                <DialogActions>
                    {error && (
                        <Alert severity="error" onClose={() => setError(false)} sx={{ mx: 4 }}>
                            Un problème est survenu, veuillez réessayer
                        </Alert>
                    )}
                    <Button autoFocus color="info" onClick={() => setOpen(false)}>
                        Annuler
                    </Button>
                    <Button type="submit" form="new-todo" color="info" autoFocus>
                        Créer une nouvelle Todo
                    </Button>
                </DialogActions>
            )}
        </StyledDialog>
    );
};

export default CreateForm;
