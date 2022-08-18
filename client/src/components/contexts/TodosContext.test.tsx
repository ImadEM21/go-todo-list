import '@testing-library/jest-dom';
import { useContext } from 'react';
import TodoProvider, { TodoContext } from './TodosContext';
import { TodoContextType } from '../../@types/todo';
import todosApi from '../../api/todos';
import usersApi from '../../api/users';
import AuthProvider, { AuthContext } from './AuthContext';
import { UserContextType } from '../../@types/user';
import data from './testData';
import { describe, test, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

describe('Todos Provider', () => {
    const TestComponent = () => {
        const { user, login, logout } = useContext(AuthContext) as UserContextType;
        const { todos, total, page, setPage, limit, setLimit, uncompleted, late, lastCompleted, getTodos, getTodo, createTodo, updateTodo, deleteTodo, completeTodo } = useContext(
            TodoContext
        ) as TodoContextType;

        if (!user) {
            return (
                <button
                    onClick={() => {
                        login({ email: 'test@mail.com', password: 'password' });
                        getTodos('124');
                    }}
                >
                    login
                </button>
            );
        }

        return (
            <ul role="todos">
                {todos.map((todo) => (
                    <li key={todo._id}>
                        {todo.title}
                        <button role={`${todo._id}-complete`}>complete</button>
                        <button role={`${todo._id}-update`}>update</button>
                        <button role={`${todo._id}-delete`}>delete</button>
                    </li>
                ))}
            </ul>
        );
    };

    test('Login and fetch todos', async () => {
        vi.spyOn(todosApi, 'getTodos').mockImplementation(() =>
            Promise.resolve({
                status: 200,
                statusText: 'OK',
                config: {},
                headers: {},
                data: data
            })
        );
        vi.spyOn(usersApi, 'login').mockImplementation(() =>
            Promise.resolve({
                status: 200,
                statusText: 'OK',
                config: {},
                headers: {},
                data: { user: { _id: '123', email: 'imad@mail.com', firstName: 'Imad', lastName: 'Elmahrad', createdAt: new Date(), updatedAt: new Date() }, token: '123' }
            })
        );

        render(
            <AuthProvider>
                <TodoProvider>
                    <TestComponent />
                </TodoProvider>
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'login' }));
        await waitFor(() => {
            expect(screen.queryByRole('button', { name: 'login' })).not.toBeInTheDocument();
            expect(screen.getByRole('todos')).toBeInTheDocument();
        });
    });
});
