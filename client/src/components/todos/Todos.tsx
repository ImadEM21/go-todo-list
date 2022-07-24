import { useContext } from 'react';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType } from '../../@types/todo';
import DashWrapper from '../dashboard/DashWrapper';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Typography, useTheme, Box, List } from '@mui/material';
import Todo from './Todo';
import First from './First';

export interface ITodosProps {}

const Todos = (props: ITodosProps) => {
    const theme = useTheme();
    const { todos } = useContext(TodoContext) as TodoContextType;
    const uncompleted = todos.filter((t) => !t.completed).length;
    const late = todos.filter((t) => new Date(t.endDate).getTime() <= new Date().getTime() && !t.completed).length;
    return (
        <DashWrapper title="MA TODO LIST" Icon={FormatListBulletedIcon}>
            <Typography component="h1" variant="h3" sx={{ color: theme.palette.text.secondary }}>
                Vous avez{' '}
                <Typography component="span" variant="h3" sx={{ color: theme.palette.text.primary }}>
                    {uncompleted}
                </Typography>{' '}
                todo{uncompleted > 1 ? 's' : ''} à valider
            </Typography>
            <Typography component="p" variant="h5" sx={{ color: theme.palette.text.secondary }}>
                Vous avez{' '}
                <Typography component="span" variant="h5" sx={{ color: theme.palette.text.primary }}>
                    {late}
                </Typography>{' '}
                todo{late > 1 ? 's' : ''} en retard
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 900, bgcolor: 'background.paper', alignSelf: 'center', mt: 2 }}>
                <List>
                    <First />
                    {todos.map((todo) => (
                        <Todo todo={todo} key={todo._id} />
                    ))}
                </List>
            </Box>
        </DashWrapper>
    );
};

export default Todos;
