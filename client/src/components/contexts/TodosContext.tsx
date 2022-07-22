import React, { createContext, useState } from 'react';
import { TodoContextType, ITodo, TodoCreated, TodoModified } from '../../@types/todo';
import todosApi from '../../api/todos';
import axios from 'axios';

export const TodoContext = createContext<TodoContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

const TodoProvider: React.FC<Props> = ({ children }) => {
    const [todos, setTodos] = useState<ITodo[]>([]);

    const getTodos = (userId: string) => {
        return new Promise<ITodo[]>(async (resolve, reject) => {
            try {
                const res = await todosApi.getTodos(userId);
                setTodos(res.data);
                resolve(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                    console.log('error response', error.response);
                    // 👇️ error: AxiosError<any, any>
                    reject(error.response?.data);
                } else {
                    console.log('unexpected error: ', error);
                    reject(error);
                    //reject(new Error('An error has occured', { cause: error as Error }));
                }
            }
        });
    };

    const getTodo = (todoId: string) => {
        return new Promise<ITodo>(async (resolve, reject) => {
            try {
                const res = await todosApi.getTodo(todoId);
                resolve(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                    console.log('error response', error.response);
                    // 👇️ error: AxiosError<any, any>
                    reject(error.response?.data);
                } else {
                    console.log('unexpected error: ', error);
                    reject(error);
                    //reject(new Error('An error has occured', { cause: error as Error }));
                }
            }
        });
    };

    const createTodo = (todo: ITodo) => {
        return new Promise<TodoCreated>(async (resolve, reject) => {
            try {
                const res = await todosApi.createTodo(todo);
                resolve(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                    console.log('error response', error.response);
                    // 👇️ error: AxiosError<any, any>
                    reject(error.response?.data);
                } else {
                    console.log('unexpected error: ', error);
                    reject(error);
                    //reject(new Error('An error has occured', { cause: error as Error }));
                }
            }
        });
    };

    const updateTodo = (todo: ITodo) => {
        return new Promise<TodoModified>(async (resolve, reject) => {
            try {
                const res = await todosApi.updateTodo(todo._id, todo);
                resolve(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                    console.log('error response', error.response);
                    // 👇️ error: AxiosError<any, any>
                    reject(error.response?.data);
                } else {
                    console.log('unexpected error: ', error);
                    reject(error);
                    //reject(new Error('An error has occured', { cause: error as Error }));
                }
            }
        });
    };

    const deleteTodo = (id: string) => {};

    const completeTodo = (todo: ITodo) => {
        return new Promise<TodoModified>(async (resolve, reject) => {
            try {
                const res = await todosApi.updateTodo(todo._id, todo);
                resolve(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                    console.log('error response', error.response);
                    // 👇️ error: AxiosError<any, any>
                    reject(error.response?.data);
                } else {
                    console.log('unexpected error: ', error);
                    reject(error);
                    //reject(new Error('An error has occured', { cause: error as Error }));
                }
            }
        });
    };

    return <TodoContext.Provider value={{ todos, getTodos, getTodo, createTodo, updateTodo, deleteTodo, completeTodo }}>{children}</TodoContext.Provider>;
};

export default TodoProvider;
