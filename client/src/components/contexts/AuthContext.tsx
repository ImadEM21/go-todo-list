import React, { createContext, useState } from 'react';
import { IUser, UserContextType, ILogin, ISignup, UpdateUser, UpdatePassword } from '../../@types/user';
import usersApi from '../../api/users';
import axios from 'axios';

export const AuthContext = createContext<UserContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
    const userObj: string | null = localStorage.getItem('user-obj');
    const [user, setUser] = useState<IUser | null>(userObj ? JSON.parse(userObj) : null);

    const login = (payload: ILogin) => {
        return new Promise<IUser>(async (resolve, reject) => {
            try {
                const res = await usersApi.login(payload);
                localStorage.setItem('user-token', res.data.token);
                localStorage.setItem('user-obj', JSON.stringify(res.data.user));
                setUser(res.data.user);
                resolve(res.data.user);
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

    const signup = (payload: ISignup) => {
        return new Promise<IUser>(async (resolve, reject) => {
            try {
                const res = await usersApi.signup(payload);
                localStorage.setItem('user-token', res.data.token);
                localStorage.setItem('user-obj', JSON.stringify(res.data.user));
                setUser(res.data.user);
                resolve(res.data.user);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                    console.log('error response', error.response);
                    reject(error.response?.data);
                } else {
                    console.log('unexpected error: ', error);
                    reject(error);
                }
            }
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-obj');
        localStorage.removeItem('todos-obj');
    };

    const updateUser = (payload: UpdateUser, userId: string) => {
        return new Promise<IUser>(async (resolve, reject) => {
            try {
                const res = await usersApi.updateUser(payload, userId);
                if (res.data.nModified < 1) {
                    throw new Error("Aucun utilisateur n'a pu être mis à jour");
                }
                localStorage.setItem('user-obj', JSON.stringify(res.data.user));
                setUser(res.data.user);
                resolve(res.data.user);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                    console.log('error response', error.response);
                    reject(error.response?.data);
                } else {
                    console.log('unexpected error: ', error);
                    reject(error);
                }
            }
        });
    };

    const updatePassword = (payload: UpdatePassword, userId: string) => {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const res = await usersApi.updatePassword(payload, userId);
                if (res.data.nModified < 1) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log('error message: ', error.message);
                    console.log('error response', error.response);
                    reject(error.response?.data);
                } else {
                    console.log('unexpected error: ', error);
                    reject(error);
                }
            }
        });
    };

    return <AuthContext.Provider value={{ user, login, signup, logout, updateUser, updatePassword }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
