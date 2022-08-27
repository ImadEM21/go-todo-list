import axios, { AxiosRequestConfig } from 'axios';

interface MyAxiosRequestConfig extends Omit<AxiosRequestConfig, 'headers'> {
    headers?: any; // this was "any" at v0.21.1 but now broken between 0.21.4 >= 0.27.2
    // Lets make it any again to make it work again.
}

const path = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

const api = axios.create({
    baseURL: path
});

api.interceptors.request.use((config: MyAxiosRequestConfig) => {
    config.headers.post.Authorization = `Bearer ${localStorage.getItem('user-token')}`;
    config.headers.get.Authorization = `Bearer ${localStorage.getItem('user-token')}`;
    config.headers.put.Authorization = `Bearer ${localStorage.getItem('user-token')}`;
    config.headers.delete.Authorization = `Bearer ${localStorage.getItem('user-token')}`;

    return config;
});

export default api;
