import axios from 'axios';
import { ILogin, ISignup, UpdatePassword, UpdateUser, UserDeleted, UserLogin, UserUpdated, UserUpdatedNumber } from '../@types/user';

const token = localStorage.getItem('user-token');

axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

const path = import.meta.env.PROD ? '/api/users' : 'http://localhost:3000/api/users';

const api = axios.create({
    baseURL: path
});

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
    return api.put<UserUpdatedNumber>(`/${userId}/password`, payload);
};

export const deleteUser = (userId: string) => {
    return api.delete<UserDeleted>(`/${userId}`);
};

export const updateAvatar = (userId: string, payload: FormData) => {
    return api.put<UserUpdated>(`/${userId}/avatar`, payload);
};

const usersApi = {
    login,
    signup,
    updateUser,
    updatePassword,
    deleteUser,
    updateAvatar
};

export default usersApi;
