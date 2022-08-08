import { ReactNode, lazy } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PrivateRoute from './PrivateRoute';
const Home = lazy(() => import('../components/home/Home'));
const Dashboard = lazy(() => import('../components/dashboard/Dashboard'));
const Todos = lazy(() => import('../components/todos/Todos'));
const NewPassword = lazy(() => import('../components/auth/NewPassword'));
const Settings = lazy(() => import('../components/settings/Settings'));
const Stats = lazy(() => import('../components/stats/Stats'));

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
        path: '/reinitialiser-mot-de-passe/:userId/:token',
        component: <NewPassword />
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
    },
    {
        id: uuidv4(),
        path: '/stats',
        component: (
            <PrivateRoute>
                <Stats />
            </PrivateRoute>
        )
    },
    {
        id: uuidv4(),
        path: '/settings',
        component: (
            <PrivateRoute>
                <Settings />
            </PrivateRoute>
        )
    }
];
