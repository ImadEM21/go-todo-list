import { useContext } from 'react';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType } from '../../@types/todo';
import DashWrapper from '../dashboard/DashWrapper';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Typography } from '@mui/material';

export interface ITodosProps {}

const Todos = (props: ITodosProps) => {
    const { todos } = useContext(TodoContext) as TodoContextType;
    const uncompleted = todos.filter((t) => !t.completed).length;
    const late = todos.filter((t) => new Date(t.endDate).getTime() <= new Date().getTime()).length;
    return (
        <DashWrapper title="MA TODO LIST" Icon={FormatListBulletedIcon}>
            <Typography>
                Vous avez {uncompleted} todo{uncompleted > 1 ? 's' : ''} à valider
            </Typography>
            <Typography>
                Vous avez {late} todo{late > 1 ? 's' : ''} en retard
            </Typography>
        </DashWrapper>
    );
};

export default Todos;
