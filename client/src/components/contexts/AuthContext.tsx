import React, { createContext, useState, useEffect } from 'react';
import { IUser, UserContextType, ILogin, ISignup } from '../../@types/user';
import usersApi from '../../api/users';
import axios from 'axios';

export const AuthContext = createContext<UserContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
    const userObj: string | null = localStorage.getItem('user-obj');
    const [user, setUser] = useState<IUser | null>(userObj ? JSON.parse(userObj) : null);

    useEffect(() => {
        const userStorage = localStorage.getItem('user-obj');
        if (userStorage && !user) setUser(JSON.parse(userStorage));
    }, [user]);

    const login = async (payload: ILogin) => {
        try {
            const res = await usersApi.login(payload);
            localStorage.setItem('user-token', res.data.token);
            localStorage.setItem('user-obj', JSON.stringify(res.data.user));
            setUser(res.data.user);
            return res.data.user;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                console.log('error response', error.response);
                // 👇️ error: AxiosError<any, any>
                return error.response?.data;
            } else {
                console.log('unexpected error: ', error);
                return error;
            }
        }
    };

    const signup = async (payload: ISignup) => {
        try {
            const res = await usersApi.signup(payload);
            localStorage.setItem('user-token', res.data.token);
            localStorage.setItem('user-obj', JSON.stringify(res.data.user));
            setUser(res.data.user);
            return res.data.user;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                console.log('error response', error.response);
                // 👇️ error: AxiosError<any, any>
                return error.response?.data;
            } else {
                console.log('unexpected error: ', error);
                return error;
            }
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user-token');
        localStorage.removeItem('user-obj');
    };

    return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
