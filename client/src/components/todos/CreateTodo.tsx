import { useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateForm from './CreateForm';
import Alert from '../ui/Alert';

export interface ICreateTodoProps {}

const CreateTodo = (props: ICreateTodoProps) => {
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccess(false);
    };

    return (
        <>
            <Button variant="contained" color="info" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ width: 'fit-content', mx: 'auto' }}>
                Nouvelle tâche
            </Button>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    La Todo a bien été créée.
                </Alert>
            </Snackbar>

            {open && <CreateForm open={open} setOpen={setOpen} setSuccess={setSuccess} />}
        </>
    );
};

export default CreateTodo;
