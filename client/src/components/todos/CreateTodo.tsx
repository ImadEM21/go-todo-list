import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export interface ICreateTodoProps {}

const CreateTodo = (props: ICreateTodoProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="contained" color="info" startIcon={<AddIcon />} sx={{ width: 'fit-content', mx: 'auto' }}>
                Nouvelle tâche
            </Button>
        </>
    );
};

export default CreateTodo;
