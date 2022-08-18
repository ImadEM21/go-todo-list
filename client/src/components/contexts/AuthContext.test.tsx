import '@testing-library/jest-dom';
import { useContext } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import usersApi from '../../api/users';
import AuthProvider, { AuthContext } from './AuthContext';
import { UserContextType } from '../../@types/user';

describe('Auth provider', () => {
    const loginForm = {
        email: 'test@mail.com',
        password: 'password'
    };
    const signupForm = {
        email: 'test1@mail.com',
        firstName: 'Andrea',
        lastName: 'Pirlo',
        password: 'pass'
    };
    const updateUserForm = {
        email: 'test2@mail.com',
        firstName: 'Leo',
        lastName: 'Messi'
    };

    const TestComponent = () => {
        const { user, login, logout, signup, updatePassword, updateUser } = useContext(AuthContext) as UserContextType;
        return (
            <div>
                {user ? (
                    <>
                        <div role="user">
                            {user.firstName} {user.lastName}
                        </div>
                        <button onClick={() => updateUser(updateUserForm, '123')}>updateUser</button>
                        <button onClick={() => updatePassword({ password: 'new-password' }, '123')}>updatePassword</button>
                        <button onClick={logout}>logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => login(loginForm)}>login</button>
                        <button onClick={() => signup(signupForm)}>signup</button>
                    </>
                )}
            </div>
        );
    };

    test('Signup', async () => {
        vi.spyOn(usersApi, 'signup').mockImplementation(() =>
            Promise.resolve({
                status: 200,
                statusText: 'OK',
                config: {},
                headers: {},
                data: { user: { _id: '123', ...signupForm, createdAt: new Date(), updatedAt: new Date() }, token: '123' }
            })
        );

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'signup' }));
        await waitFor(() => {
            expect(screen.getByRole('user')).toBeInTheDocument();
            expect(screen.getByText(/Andrea Pirlo/i)).toBeDefined();
            expect(screen.queryByRole('button', { name: 'login' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'signup' })).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'updateUser' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'updatePassword' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'logout' })).toBeInTheDocument();
        });
    });

    test('Update User', async () => {
        vi.spyOn(usersApi, 'updateUser').mockImplementation(() =>
            Promise.resolve({
                status: 200,
                statusText: 'OK',
                config: {},
                headers: {},
                data: { user: { _id: '123', ...updateUserForm, createdAt: new Date(), updatedAt: new Date() }, nModified: 1 }
            })
        );

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'updateUser' }));
        await waitFor(() => {
            expect(screen.getByRole('user')).toBeInTheDocument();
            expect(screen.getByText(/Leo Messi/i)).toBeDefined();
            expect(screen.queryByRole('button', { name: 'login' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'signup' })).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'updateUser' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'updatePassword' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'logout' })).toBeInTheDocument();
        });
    });

    test('Update password', async () => {
        vi.spyOn(usersApi, 'updatePassword').mockImplementation(() =>
            Promise.resolve({
                status: 200,
                statusText: 'OK',
                config: {},
                headers: {},
                data: { user: { _id: '123', ...updateUserForm, createdAt: new Date(), updatedAt: new Date() }, nModified: 1 }
            })
        );

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'updatePassword' }));
        await waitFor(() => {
            expect(screen.getByRole('user')).toBeInTheDocument();
            expect(screen.getByText(/Leo Messi/i)).toBeDefined();
            expect(screen.queryByRole('button', { name: 'login' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'signup' })).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'updateUser' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'updatePassword' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'logout' })).toBeInTheDocument();
        });
    });

    test('Logout', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'logout' }));
        await waitFor(() => {
            expect(screen.queryByRole('user')).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'login' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'signup' })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'updateUser' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'updatePassword' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'logout' })).not.toBeInTheDocument();
        });
    });

    test('Login', async () => {
        vi.spyOn(usersApi, 'login').mockImplementation(() =>
            Promise.resolve({
                status: 201,
                statusText: 'OK',
                config: {},
                headers: {},
                data: { user: { _id: '123', email: 'imad@mail.com', firstName: 'Imad', lastName: 'Elmahrad', createdAt: new Date(), updatedAt: new Date() }, token: '123' }
            })
        );

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'login' }));
        await waitFor(() => {
            expect(screen.getByRole('user')).toBeInTheDocument();
            expect(screen.getByText(/Imad Elmahrad/i)).toBeDefined();
            expect(screen.queryByRole('button', { name: 'login' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'signup' })).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'updateUser' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'updatePassword' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'logout' })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: 'logout' }));
        await waitFor(() => {
            expect(screen.queryByRole('user')).not.toBeInTheDocument();
        });
    });
});
