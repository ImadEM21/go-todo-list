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
    let todosData = localStorage.getItem('todos-data');
    let dataParsed: GetTodos | null = null;
    if (todosData) {
        dataParsed = JSON.parse(todosData);
    }
    const [todos, setTodos] = useState<ITodo[]>(dataParsed?.todos ?? []);
    const [total, setTotal] = useState<number>(dataParsed?.total ?? 0);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [uncompleted, setUncompleted] = useState<number>(dataParsed?.uncompleted ?? 0);
    const [late, setLate] = useState<number>(dataParsed?.late ?? 0);
    const [lastCompleted, setLastCompleted] = useState<GraphData[]>(dataParsed?.lastCompleted ?? []);

    useEffectDebugger(
        (changedDeps: Deps) => {
            const limitHasChanged = changedDeps?.limit?.before === undefined;
            const pageHasChanged = changedDeps?.page?.before === undefined;
            if (limitHasChanged && pageHasChanged) {
            } else {
                if ((changedDeps.limit || changedDeps.page) && user) {
                    getTodos(user?._id);
                }
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
                    localStorage.setItem('todos-data', JSON.stringify({ ...res.data, lastCompleted: lastCompletedParsed }));
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
                    localStorage.setItem('todos-data', JSON.stringify({ ...res.data, lastCompleted: lastCompletedParsed }));
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

    const updateTodo = useCallback(
        (todo: ITodo) => {
            return new Promise<TodoModified>(async (resolve, reject) => {
                try {
                    if (!user) throw new Error('Vous avez été déconnecté, veuillez vous reconnecter à nouveau.');
                    const res = await todosApi.updateTodo(todo._id, todo, limit, page + 1);
                    if (res.data.nModified < 1) {
                        throw new Error("La todo n'a pas pu être modifié, veuillez réessayer.");
                    }
                    const lastCompletedParsed: GraphData[] = res.data.lastCompleted.map((elt: GraphData) => ({ date: new Date(elt.date).toLocaleDateString(), total: elt.total }));
                    localStorage.setItem('todos-data', JSON.stringify({ ...res.data, lastCompleted: lastCompletedParsed }));
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

    const deleteTodo = useCallback(
        (id: string) => {
            return new Promise<TodoDeleted>(async (resolve, reject) => {
                try {
                    if (!user) throw new Error('Vous avez été déconnecté, veuillez vous reconnecter à nouveau.');
                    const res = await todosApi.deleteTodo(id, user._id, limit, page + 1);
                    if (res.data.nDeleted < 1) {
                        throw new Error("La todo n'a pas pu être supprimée, veuillez réessayer.");
                    }
                    const lastCompletedParsed: GraphData[] = res.data.lastCompleted.map((elt: GraphData) => ({ date: new Date(elt.date).toLocaleDateString(), total: elt.total }));
                    localStorage.setItem('todos-data', JSON.stringify({ ...res.data, lastCompleted: lastCompletedParsed }));
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
        [limit, page, user]
    );

    const completeTodo = useCallback(
        (id: string, payload: Complete) => {
            return new Promise<TodoModified>(async (resolve, reject) => {
                try {
                    if (!user) throw new Error('Vous avez été déconnecté, veuillez vous reconnecter à nouveau.');
                    const res = await todosApi.completeTodo(id, payload, user._id, limit, page + 1);
                    if (res.data.nModified < 1) {
                        throw new Error("La Todo n'a pas pu être modifié, veuillez réessayer.");
                    }
                    const lastCompletedParsed: GraphData[] = res.data.lastCompleted.map((elt: GraphData) => ({ date: new Date(elt.date).toLocaleDateString(), total: elt.total }));
                    localStorage.setItem('todos-data', JSON.stringify({ ...res.data, lastCompleted: lastCompletedParsed }));
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

    return (
        <TodoContext.Provider value={{ todos, total, page, setPage, limit, setLimit, uncompleted, late, lastCompleted, getTodos, getTodo, createTodo, updateTodo, deleteTodo, completeTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export default TodoProvider;
