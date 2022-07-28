import { ReactNode, useState } from 'react';
import { ITodo } from '../../@types/todo';
import { ListItemButton } from '@mui/material';
import DialogDetails from './DialogDetails';

export interface IDetailsProps {
    todo: ITodo;
    children: ReactNode;
}

const Details = ({ todo, children }: IDetailsProps) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <ListItemButton role={undefined} onClick={handleClickOpen} dense>
                {children}
            </ListItemButton>

            {open && <DialogDetails open={open} setOpen={setOpen} todo={todo} />}
        </>
    );
};

export default Details;
