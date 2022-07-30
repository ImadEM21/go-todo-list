import { ReactNode, useState } from 'react';
import { ITodo } from '../../@types/todo';
import { TableRow } from '@mui/material';
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
            <TableRow
                sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: '#E8E8E8'
                    }
                }}
                onClick={handleClickOpen}
            >
                {children}
            </TableRow>

            {open && <DialogDetails open={open} setOpen={setOpen} todo={todo} />}
        </>
    );
};

export default Details;
