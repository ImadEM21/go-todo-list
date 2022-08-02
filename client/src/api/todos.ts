import axios from 'axios';
import { ITodo, Complete, CreateTodo } from '../@types/todo';

const token = localStorage.getItem('chillingbook-user-token');

axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

const path = import.meta.env.PROD ? '/api/users' : 'http://localhost:3000/api/todos';

const api = axios.create({
    baseURL: path
});

export const getTodos = (userId: string, limit: number, page: number) => {
    return api.get('/', { params: { userId, limit, page } });
};

export const getTodo = (todoId: string) => {
    return api.get(`/${todoId}`);
};

export const createTodo = (todo: CreateTodo) => {
    return api.post('/', todo);
};

export const updateTodo = (todoId: string, todo: ITodo) => {
    return api.put(`/${todoId}`, todo);
};

export const completeTodo = (todoId: string, payload: Complete) => {
    return api.put(`/${todoId}/complete`, payload);
};

export const deleteTodo = (todoId: string) => {
    return api.delete(`/${todoId}`);
};

export const getLastCompleted = (userId: string) => {
    return api.get(`/${userId}/completed`);
};

const todosApi = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    getLastCompleted
};

export default todosApi;
