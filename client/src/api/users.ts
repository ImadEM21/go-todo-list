import axios from 'axios';
import { ILogin, ISignup, IUser } from '../@types/user';

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

export const login = (payload: ILogin) => {
    return api.post<UserLogin>('/login', payload);
};

export const signup = (payload: ISignup) => {
    return api.post<UserLogin>('/signup', payload);
};

const usersApi = {
    login,
    signup
};

export default usersApi;
