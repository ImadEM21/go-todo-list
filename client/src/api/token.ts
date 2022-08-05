import axios from 'axios';

const path = import.meta.env.PROD ? '/api/tokens' : 'http://localhost:3000/api/tokens';

const api = axios.create({
    baseURL: path
});

type CreateToken = {
    email: string;
};

type ResetPassword = {
    password: string;
};

export const createToken = (payload: CreateToken) => {
    return api.post('/', payload);
};

export const resetPassword = (userId: string, token: string, payload: ResetPassword) => {
    return api.post(`/${userId}/${token}`, payload);
};

const tokensApi = {
    createToken,
    resetPassword
};

export default tokensApi;
