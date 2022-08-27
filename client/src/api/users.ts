import { ILogin, ISignup, UpdatePassword, UpdateUser, UserDeleted, UserLogin, UserUpdated, UserUpdatedNumber } from '../@types/user';
import api from './apiUtils';

const PREFIX = 'users';

export const login = (payload: ILogin) => {
    return api.post<UserLogin>(`/${PREFIX}/login`, payload);
};

export const signup = (payload: ISignup) => {
    return api.post<UserLogin>(`/${PREFIX}/signup`, payload);
};

export const updateUser = (payload: UpdateUser, userId: string) => {
    return api.put<UserUpdated>(`/${PREFIX}/${userId}`, payload);
};

export const updatePassword = (payload: UpdatePassword, userId: string) => {
    return api.put<UserUpdatedNumber>(`/${PREFIX}/${userId}/password`, payload);
};

export const deleteUser = (userId: string) => {
    return api.delete<UserDeleted>(`/${PREFIX}/${userId}`);
};

export const updateAvatar = (userId: string, payload: FormData) => {
    return api.put<UserUpdated>(`/${PREFIX}/${userId}/avatar`, payload);
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
