import React, { createContext, useState } from 'react';
import { TodoContextType, ITodo } from '../../@types/todo';

export const TodoContext = createContext<TodoContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

const TodoProvider: React.FC<Props> = ({ children }) => {
    const [todos, setTodos] = useState<ITodo[]>([]);

    const createTodo = (todo: ITodo) => {};

    const updateTodo = (todo: ITodo) => {};

    const deleteTodo = (id: string) => {};

    const completeTodo = (id: string) => {};

    return <TodoContext.Provider value={{ todos, createTodo, updateTodo, deleteTodo, completeTodo }}>{children}</TodoContext.Provider>;
};

export default TodoProvider;
