import axios from 'axios';
import { ITodo, Complete, CreateTodo, GetTodos, TodoCreated, TodoModified, TodoDeleted } from '../@types/todo';

const token = localStorage.getItem('chillingbook-user-token');

axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

const path = import.meta.env.PROD ? '/api/todos' : 'http://localhost:3000/api/todos';

const api = axios.create({
    baseURL: path
});

export const getTodos = (userId: string, limit: number, page: number) => {
    return api.get<GetTodos>('/', { params: { userId, limit, page } });
};

export const getTodo = (todoId: string) => {
    return api.get<ITodo>(`/${todoId}`);
};

export const createTodo = (todo: CreateTodo, limit: number, page: number) => {
    return api.post<TodoCreated>('/', todo, { params: { limit, page } });
};

export const updateTodo = (todoId: string, todo: ITodo, limit: number, page: number) => {
    return api.put<TodoModified>(`/${todoId}`, todo, { params: { limit, page } });
};

export const completeTodo = (todoId: string, payload: Complete, userId: string, limit: number, page: number) => {
    return api.put<TodoModified>(`/${todoId}/complete`, payload, { params: { userId, limit, page } });
};

export const deleteTodo = (todoId: string, userId: string, limit: number, page: number) => {
    return api.delete<TodoDeleted>(`/${todoId}`, { params: { userId, limit, page } });
};

const todosApi = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    completeTodo
};

export default todosApi;
