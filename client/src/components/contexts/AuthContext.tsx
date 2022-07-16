import React, { createContext, useState } from 'react';
import { IUser, UserContextType, ILogin, ISignup } from '../../@types/user';

export const AuthContext = createContext<UserContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);

    const login = (payload: ILogin) => {};

    const signup = (payload: ISignup) => {};

    const logout = (id: string) => {};

    return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
