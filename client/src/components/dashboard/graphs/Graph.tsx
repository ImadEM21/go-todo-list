import { useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material';
import { TodoContext } from '../../contexts/TodosContext';
import { TodoContextType } from '../../../@types/todo';

export interface IGraphProps {}

const Graph = (props: IGraphProps) => {
    const { lastCompleted } = useContext(TodoContext) as TodoContextType;
    console.log(lastCompleted);
    const theme = useTheme();
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={500}
                height={300}
                data={lastCompleted}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke={theme.palette.text.primary} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Graph;
