export interface IUser {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
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

export type UpdateUser = {
    firstName: string;
    lastName: string;
    email: string;
};

export type UpdatePassword = {
    password: string;
};

export type UserDeleted = {
    nDeleted: number;
    todosDeleted: number;
};

export type UserLogin = {
    token: string;
    user: IUser;
};

export type UserUpdated = {
    user: IUser;
    nModified: number;
};

export type UserUpdatedNumber = {
    nModified: number;
};

export type UserContextType = {
    user: IUser | null;
    login: (payload: ILogin) => Promise<IUser>;
    signup: (payload: ISignup) => Promise<IUser>;
    logout: () => void;
    updateUser: (payload: UpdateUser, userId: string) => Promise<IUser>;
    updatePassword: (payload: UpdatePassword, userId: string) => Promise<boolean>;
    updateAvatar: (payload: FormData, userId: string) => Promise<boolean>;
    deleteAvatar: (userId: string) => Promise<boolean>;
    deleteUser: (userId: string) => Promise<UserDeleted>;
};
