import { ITodo, Complete, CreateTodo, GetTodos, TodoCreated, TodoModified, TodoDeleted } from '../@types/todo';
import api from './apiUtils';

const PREFIX = 'todos';

export const getTodos = (userId: string, limit: number, page: number) => {
    return api.get<GetTodos>(`/${PREFIX}/`, { params: { userId, limit, page } });
};

export const getTodo = (todoId: string) => {
    return api.get<ITodo>(`/${PREFIX}/${todoId}`);
};

export const createTodo = (todo: CreateTodo, limit: number, page: number) => {
    return api.post<TodoCreated>(`/${PREFIX}/`, todo, { params: { limit, page } });
};

export const updateTodo = (todoId: string, todo: ITodo, limit: number, page: number) => {
    return api.put<TodoModified>(`/${PREFIX}/${todoId}`, todo, { params: { limit, page } });
};

export const completeTodo = (todoId: string, payload: Complete, userId: string, limit: number, page: number) => {
    return api.put<TodoModified>(`/${PREFIX}/${todoId}/complete`, payload, { params: { userId, limit, page } });
};

export const deleteTodo = (todoId: string, userId: string, limit: number, page: number) => {
    return api.delete<TodoDeleted>(`/${PREFIX}/${todoId}`, { params: { userId, limit, page } });
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
