import { ReactNode, lazy } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PrivateRoute from './PrivateRoute';
const Home = lazy(() => import('../components/home/Home'));
const Dashboard = lazy(() => import('../components/dashboard/Dashboard'));
const Todos = lazy(() => import('../components/todos/Todos'));

type Route = {
    id: string;
    path: string;
    component: ReactNode;
};

export const routes: Route[] = [
    {
        id: uuidv4(),
        path: '/',
        component: <Home />
    },
    {
        id: uuidv4(),
        path: '/dashboard',
        component: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    },
    {
        id: uuidv4(),
        path: '/todos',
        component: (
            <PrivateRoute>
                <Todos />
            </PrivateRoute>
        )
    }
];
