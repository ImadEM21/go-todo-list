import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateForm from './CreateForm';

export interface ICreateTodoProps {}

const CreateTodo = (props: ICreateTodoProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="contained" color="info" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ width: 'fit-content', mx: 'auto' }}>
                Nouvelle tâche
            </Button>

            {open && <CreateForm open={open} setOpen={setOpen} />}
        </>
    );
};

export default CreateTodo;
