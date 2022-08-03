import { useContext } from 'react';
import { TodoContext } from '../contexts/TodosContext';
import { TodoContextType } from '../../@types/todo';
import DashWrapper from '../dashboard/DashWrapper';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Typography, useTheme, Grid } from '@mui/material';
import TodosTable from './TodosTable';
import CreateTodo from './CreateTodo';

export interface ITodosProps {}

const Todos = (props: ITodosProps) => {
    const theme = useTheme();
    const { todos, uncompleted, late } = useContext(TodoContext) as TodoContextType;
    return (
        <DashWrapper title="MA TODO LIST" Icon={FormatListBulletedIcon}>
            <Grid container>
                <Grid item xs={12} md={6} display="flex" flexDirection="column">
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
                </Grid>
                <Grid item xs={12} md={6} display="flex" flexDirection="column" alignSelf="center">
                    <CreateTodo />
                </Grid>
            </Grid>
            <TodosTable todos={todos} />
        </DashWrapper>
    );
};

export default Todos;
