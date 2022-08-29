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
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';

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
                    <li key={todo._id} role="todo">
                        {todo.title}
                        <button>{todo.completed ? 'uncomplete' : 'complete'}</button>
                        <button>update</button>
                        <button>delete</button>
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
                data: {
                    user: {
                        _id: '123',
                        email: 'imad@mail.com',
                        firstName: 'Imad',
                        lastName: 'Elmahrad',
                        createdAt: new Date().toLocaleDateString(),
                        updatedAt: new Date().toLocaleDateString(),
                        avatar: ''
                    },
                    token: '123'
                }
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
            const list = screen.getByRole('todos');
            const { getAllByRole } = within(list);
            const items = getAllByRole('todo');

            expect(screen.queryByRole('button', { name: 'login' })).not.toBeInTheDocument();
            expect(list).toBeInTheDocument();
            expect(items.length).toBe(5);
        });
    });
});
