import api from './apiUtils';

const PREFIX = 'tokens';

type CreateToken = {
    email: string;
};

type ResetPassword = {
    password: string;
};

export const createToken = (payload: CreateToken) => {
    return api.post(`/${PREFIX}/`, payload);
};

export const resetPassword = (userId: string, token: string, payload: ResetPassword) => {
    return api.post(`/${PREFIX}/${userId}/${token}`, payload);
};

const tokensApi = {
    createToken,
    resetPassword
};

export default tokensApi;
