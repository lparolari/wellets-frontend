import localStorageConfig from 'Config/localStorage';
import { useAuth } from 'Hooks/auth';
import React, { useMemo } from 'react';
import {
  Redirect,
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
} from 'react-router-dom';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user: storeUser } = useAuth();

  const user = useMemo(
    () => localStorage.getItem(localStorageConfig.user_identifier),
    // eslint-disable-next-line
    [storeUser],
  );

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) =>
        isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/menu',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default Route;
