import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const RestrictedRoute = ({component: Component, restricted, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            !isConnected() ?
                <Redirect to="/dashboard" />
                : <Component {...props} />
        )} />
    );
};

export default RestrictedRoute;