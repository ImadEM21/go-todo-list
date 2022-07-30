import React, { useState, forwardRef, useContext } from 'react';
import { ITodo } from '../../@types/todo';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme, useMediaQuery, Slide, styled, TextField, FormControlLabel, Checkbox, CircularProgress, Alert } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useForm } from 'react-hook-form';
import Editor from './Editor';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/esm/locale/fr/index.js';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType } from '../../@types/todo';
import { AuthContext } from '../contexts/AuthContext';
import { UserContextType } from '../../@types/user';
import { Transition, Inputs } from './DialogDetails';

export interface ICreateFormProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Form = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
}));

const CreateForm = ({ open, setOpen }: ICreateFormProps) => {
    const { updateTodo } = useContext(TodoContext) as TodoContextType;
    const { user } = useContext(AuthContext) as UserContextType;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty }
    } = useForm<Inputs>({ mode: 'onBlur', defaultValues: { title: '', completed: false } });
    const [description, setDescription] = useState<string>('');
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const onSubmit = async (data: Inputs) => {};

    const handleChange = (newValue: Date | null) => {
        setEndDate(newValue);
    };

    return (
        <Dialog fullScreen={fullScreen} maxWidth="md" open={open} onClose={() => setOpen(false)} aria-labelledby="details-todo" scroll="paper" TransitionComponent={Transition}>
            <DialogTitle id="details-new-todo">Nouvelle tâche</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Form onSubmit={handleSubmit(onSubmit)} id="new-todo">
                        <TextField {...register('title', { required: true })} label="Titre" type="text" color="info" variant="filled" required />
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
                        <FormControlLabel label="Tâche finie" control={<Checkbox {...register('completed')} defaultChecked={false} color="info" />} />
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
                    {success && (
                        <Alert severity="success" onClose={() => setSuccess(false)} sx={{ mx: 4 }}>
                            La Todo a bien été mise à jour
                        </Alert>
                    )}
                    <Button autoFocus color="info" onClick={() => setOpen(false)}>
                        Annuler
                    </Button>
                    <Button type="submit" form="new-todo" color="info" disabled={disabled} autoFocus>
                        Mettre à jour
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default CreateForm;
