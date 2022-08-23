import React from 'react';
import { Route } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

const routes = [
    {
        id: uuidv4(),
        path: '/'
    },
    {
        id: uuidv4(),
        path: '/reinitialiser-mot-de-passe/:userId/:token'
    },
    {
        id: uuidv4(),
        path: '/dashboard'
    },
    {
        id: uuidv4(),
        path: '/todos'
    },
    {
        id: uuidv4(),
        path: '/stats'
    },
    {
        id: uuidv4(),
        path: '/settings'
    }
];

export default (
    <Route>
        {routes.map((route) => (
            <Route path={route.path} key={route.id} />
        ))}
    </Route>
);
