import axios from 'axios';
import { ILogin, ISignup, IUser, UpdatePassword, UpdateUser } from '../@types/user';

const token = localStorage.getItem('user-token');

axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

const path = import.meta.env.PROD ? '/api/users' : 'http://localhost:3000/api/users';

const api = axios.create({
    baseURL: path
});

type UserLogin = {
    token: string;
    user: IUser;
};

type UserUpdated = {
    user: IUser;
    nModified: number;
};

export const login = (payload: ILogin) => {
    return api.post<UserLogin>('/login', payload);
};

export const signup = (payload: ISignup) => {
    return api.post<UserLogin>('/signup', payload);
};

export const updateUser = (payload: UpdateUser, userId: string) => {
    return api.put<UserUpdated>(`/${userId}`, payload);
};

export const updatePassword = (payload: UpdatePassword, userId: string) => {
    return api.put<UserUpdated>(`/${userId}/password`, payload);
};

const usersApi = {
    login,
    signup,
    updateUser,
    updatePassword
};

export default usersApi;
