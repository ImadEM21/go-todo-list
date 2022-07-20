import { ITodo } from './todo';

export interface IUser {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    todos: ITodo[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface ISignup {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export type UserContextType = {
    user: IUser | null;
    login: (payload: ILogin) => Promise<IUser>;
    signup: (payload: ISignup) => Promise<IUser>;
    logout: () => void;
};
