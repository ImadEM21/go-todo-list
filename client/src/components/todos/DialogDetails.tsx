import React, { useState, forwardRef, useContext } from 'react';
import { ITodo } from '../../@types/todo';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme, useMediaQuery, Slide, styled, TextField, FormControlLabel, Checkbox, CircularProgress, Alert } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useForm } from 'react-hook-form';
import Editor from './Editor';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/esm/locale/fr/index.js';
import useEffectDebugger from '../../hooks/useEffectDebugger';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType } from '../../@types/todo';

export const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IDialogDetailsProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    todo: ITodo;
}

export type Inputs = {
    title: string;
    completed: boolean;
};

type Deps = {
    endDate: {
        after: Date;
        before: string | undefined;
    };
    isDirty: {
        after: boolean;
        before: boolean | undefined;
    };
    description: {
        after: string;
        before: string | undefined;
    };
};

const Form = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
}));

const DialogDetails = ({ open, setOpen, todo }: IDialogDetailsProps) => {
    const { updateTodo } = useContext(TodoContext) as TodoContextType;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {
        register,
        handleSubmit,
        formState: { isDirty }
    } = useForm<Inputs>({ mode: 'onBlur', defaultValues: { title: todo.title, completed: todo.completed } });
    const [description, setDescription] = useState<string>(todo.description);
    const [endDate, setEndDate] = useState<Date | null>(new Date(todo.endDate));
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const onSubmit = async (data: Inputs) => {
        setLoading(true);
        const payload: ITodo = {
            ...todo,
            ...data,
            description,
            endDate: endDate ? endDate?.toISOString() : new Date(todo.endDate).toISOString()
        };
        payload.completed = /true/i.test(data.completed.toString());
        try {
            const res = await updateTodo(payload);
            if (res.nModified > 0) {
                setSuccess(true);
            }
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

    useEffectDebugger(
        (changedDeps: Deps) => {
            const descriptionHasChanged = changedDeps?.description?.before === undefined;
            const endDateHasChanged = changedDeps?.endDate?.before === undefined;
            const isDirtyHasChanged = changedDeps?.isDirty?.before === undefined;
            if (descriptionHasChanged && endDateHasChanged && isDirtyHasChanged) {
                setDisabled(true);
            } else {
                if (changedDeps.description || changedDeps.endDate || changedDeps.isDirty) {
                    setDisabled(false);
                }
            }
        },
        [endDate, isDirty, description],
        ['endDate', 'isDirty', 'description']
    );

    return (
        <Dialog fullScreen={fullScreen} maxWidth="md" open={open} onClose={() => setOpen(false)} aria-labelledby="details-todo" scroll="paper" TransitionComponent={Transition}>
            <DialogTitle id={`details-todo-${todo._id}`}>{todo.title}</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Form onSubmit={handleSubmit(onSubmit)} id={`update-todo-${todo._id}`}>
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
                        <FormControlLabel label="Tâche terminée" control={<Checkbox {...register('completed')} defaultChecked={todo.completed} color="info" />} />
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
                    <Button type="submit" form={`update-todo-${todo._id}`} color="info" disabled={disabled} autoFocus>
                        Mettre à jour
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default DialogDetails;
