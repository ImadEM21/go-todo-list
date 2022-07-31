import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../components/contexts/AuthContext';
import { UserContextType } from '../@types/user';

export interface IPrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute = ({ children }: IPrivateRouteProps) => {
    const { user } = useContext(AuthContext) as UserContextType;
    const location = useLocation();
    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
};

export default PrivateRoute;
