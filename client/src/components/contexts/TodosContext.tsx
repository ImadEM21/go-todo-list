import React, { createContext, useState, useContext, useCallback } from 'react';
import { TodoContextType, ITodo, TodoCreated, TodoModified, Complete, TodoDeleted, CreateTodo, GetTodos, GraphData } from '../../@types/todo';
import todosApi from '../../api/todos';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { UserContextType } from '../../@types/user';
import useEffectDebugger from '../../hooks/useEffectDebugger';

export const TodoContext = createContext<TodoContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

type Deps = {
    page: {
        after: number;
        before: number | undefined;
    };
    limit: {
        after: number;
        before: number | undefined;
    };
};

const TodoProvider: React.FC<Props> = ({ children }) => {
    const { user } = useContext(AuthContext) as UserContextType;
    let todoStorage = localStorage.getItem('todos-obj');
    let parsed = null;
    if (todoStorage) {
        parsed = JSON.parse(todoStorage);
    }
    let totalStorage = localStorage.getItem('todos-total');
    let lastCompletedStorage = localStorage.getItem('todos-lastCompleted');
    let completedParsed = null;
    if (lastCompletedStorage) {
        completedParsed = JSON.parse(lastCompletedStorage);
    }
    const [todos, setTodos] = useState<ITodo[]>(parsed ?? []);
    const [total, setTotal] = useState(totalStorage ? parseInt(totalStorage) : 0);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [uncompleted, setUncompleted] = useState(0);
    const [late, setLate] = useState(0);
    const [lastCompleted, setLastCompleted] = useState<GraphData[]>(completedParsed ?? []);

    useEffectDebugger(
        (changedDeps: Deps) => {
            if ((changedDeps.limit || changedDeps.page) && user) {
                getTodos(user?._id);
            }
        },
        [page, limit],
        ['page', 'limit']
    );

    const getTodos = useCallback(
        (userId: string) => {
            return new Promise<GetTodos>(async (resolve, reject) => {
                try {
                    const res = await todosApi.getTodos(userId, limit, page + 1);
                    const lastCompletedParsed: GraphData[] = res.data.lastCompleted.map((elt: GraphData) => ({ date: new Date(elt.date).toLocaleDateString(), total: elt.total }));
                    localStorage.setItem('todos-obj', JSON.stringify(res.data.todos));
                    localStorage.setItem('todos-total', JSON.stringify(res.data.total));
                    localStorage.setItem('todos-lastCompleted', JSON.stringify(lastCompletedParsed));
                    setTodos(res.data.todos ?? []);
                    setTotal(res.data.total ?? 0);
                    setUncompleted(res.data.uncompleted ?? 0);
                    setLate(res.data.late ?? 0);
                    setLastCompleted(lastCompletedParsed ?? []);
                    resolve({ todos: res.data.todos, total: res.data.total, uncompleted: res.data.uncompleted, late: res.data.late, lastCompleted: lastCompletedParsed });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error('error message: ', error.message);
                        console.error('error response', error.response);
                        // 👇️ error: AxiosError<any, any>
                        reject(error.response?.data);
                    } else {
                        console.error('unexpected error: ', error);
                        reject(error);
                        //reject(new Error('An error has occured', { cause: error as Error }));
                    }
                }
            });
        },
        [limit, page]
    );

    const getTodo = useCallback((todoId: string) => {
        return new Promise<ITodo>(async (resolve, reject) => {
            try {
                const res = await todosApi.getTodo(todoId);
                resolve(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('error message: ', error.message);
                    console.error('error response', error.response);
                    // 👇️ error: AxiosError<any, any>
                    reject(error.response?.data);
                } else {
                    console.error('unexpected error: ', error);
                    reject(error);
                    //reject(new Error('An error has occured', { cause: error as Error }));
                }
            }
        });
    }, []);

    const createTodo = useCallback(
        (todo: CreateTodo) => {
            return new Promise<TodoCreated>(async (resolve, reject) => {
                try {
                    if (!user) throw new Error('Vous avez été déconnecté, veuillez vous reconnecter à nouveau.');
                    const res = await todosApi.createTodo(todo, limit, page + 1);
                    const lastCompletedParsed: GraphData[] = res.data.lastCompleted.map((elt: GraphData) => ({ date: new Date(elt.date).toLocaleDateString(), total: elt.total }));
                    localStorage.setItem('todos-obj', JSON.stringify(res.data.todos));
                    localStorage.setItem('todos-total', JSON.stringify(res.data.total));
                    localStorage.setItem('todos-lastCompleted', JSON.stringify(lastCompletedParsed));
                    setTodos(res.data.todos ?? []);
                    setTotal(res.data.total ?? 0);
                    setUncompleted(res.data.uncompleted ?? 0);
                    setLate(res.data.late ?? 0);
                    setLastCompleted(lastCompletedParsed ?? []);
                    resolve(res.data);
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error('error message: ', error.message);
                        console.error('error response', error.response);
                        // 👇️ error: AxiosError<any, any>
                        reject(error.response?.data);
                    } else {
                        console.error('unexpected error: ', error);
                        reject(error);
                        //reject(new Error('An error has occured', { cause: error as Error }));
                    }
                }
            });
        },
        [user, limit, page]
    );

    const updateTodo = (todo: ITodo) => {
        return new Promise<TodoModified>(async (resolve, reject) => {
            try {
                if (!user) throw new Error('Vous avez été déconnecté, veuillez vous reconnecter à nouveau.');
                const res = await todosApi.updateTodo(todo._id, todo);
                await getTodos(user._id);
                resolve(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('error message: ', error.message);
                    console.error('error response', error.response);
                    // 👇️ error: AxiosError<any, any>
                    reject(error.response?.data);
                } else {
                    console.error('unexpected error: ', error);
                    reject(error);
                    //reject(new Error('An error has occured', { cause: error as Error }));
                }
            }
        });
    };

    const deleteTodo = (id: string) => {
        return new Promise<TodoDeleted>(async (resolve, reject) => {
            try {
                if (!user) throw new Error('Vous avez été déconnecté, veuillez vous reconnecter à nouveau.');
                const res = await todosApi.deleteTodo(id);
                await getTodos(user._id);
                resolve(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('error message: ', error.message);
                    console.error('error response', error.response);
                    // 👇️ error: AxiosError<any, any>
                    reject(error.response?.data);
                } else {
                    console.error('unexpected error: ', error);
                    reject(error);
                    //reject(new Error('An error has occured', { cause: error as Error }));
                }
            }
        });
    };

    const completeTodo = (id: string, payload: Complete) => {
        return new Promise<TodoModified>(async (resolve, reject) => {
            try {
                if (!user) throw new Error('Vous avez été déconnecté, veuillez vous reconnecter à nouveau.');
                const res = await todosApi.completeTodo(id, payload);
                await getTodos(user._id);
                resolve(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('error message: ', error.message);
                    console.error('error response', error.response);
                    // 👇️ error: AxiosError<any, any>
                    reject(error.response?.data);
                } else {
                    console.error('unexpected error: ', error);
                    reject(error);
                    //reject(new Error('An error has occured', { cause: error as Error }));
                }
            }
        });
    };

    return (
        <TodoContext.Provider value={{ todos, total, page, setPage, limit, setLimit, uncompleted, late, lastCompleted, getTodos, getTodo, createTodo, updateTodo, deleteTodo, completeTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export default TodoProvider;
