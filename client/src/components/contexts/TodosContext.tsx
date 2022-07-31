import React, { createContext, useState } from 'react';
import { TodoContextType, ITodo, TodoCreated, TodoModified, Complete, TodoDeleted, CreateTodo } from '../../@types/todo';
import todosApi from '../../api/todos';
import axios from 'axios';

export const TodoContext = createContext<TodoContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

const TodoProvider: React.FC<Props> = ({ children }) => {
    let todoStorage = localStorage.getItem('todos-obj');
    let parsed = null;
    if (todoStorage) {
        parsed = JSON.parse(todoStorage);
    }
    const [todos, setTodos] = useState<ITodo[]>(parsed ? parsed : []);

    const getTodos = (userId: string) => {
        return new Promise<ITodo[]>(async (resolve, reject) => {
            try {
                const res = await todosApi.getTodos(userId);
                localStorage.setItem('todos-obj', JSON.stringify(res.data));
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

    const createTodo = (todo: CreateTodo, userId: string) => {
        return new Promise<TodoCreated>(async (resolve, reject) => {
            try {
                const res = await todosApi.createTodo(todo);
                await getTodos(userId);
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

    const updateTodo = (todo: ITodo, userId: string) => {
        return new Promise<TodoModified>(async (resolve, reject) => {
            try {
                const res = await todosApi.updateTodo(todo._id, todo);
                await getTodos(userId);
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

    const deleteTodo = (id: string, userId: string) => {
        return new Promise<TodoDeleted>(async (resolve, reject) => {
            try {
                const res = await todosApi.deleteTodo(id);
                await getTodos(userId);
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

    const completeTodo = (id: string, payload: Complete, userId: string) => {
        return new Promise<TodoModified>(async (resolve, reject) => {
            try {
                const res = await todosApi.completeTodo(id, payload);
                await getTodos(userId);
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
