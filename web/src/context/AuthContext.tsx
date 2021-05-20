import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom";
import { Navbar } from '../components/Navbar';

type AuthState = {
  admin: Admin | null;
  signedIn: boolean;
  login: (email: string, password: string, rememberMe: boolean) => void,
  logout: () => void,
};

const val: AuthState = {
  isAuthenticated: false,
  signin: () => { },
  signout: () => { },
};

export const AuthContext = createContext<AuthState>(val);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(false);
  },[]);

  const signin = (cb: () => void): void => {
    setIsAuthenticated(true);
    cb();
  };

  const signout = (cb: () => void): void => {
    setIsAuthenticated(false);
    cb();
  };

  const state = {
    isAuthenticated: isAuthenticated,
    signin: signin,
    signout: signout,
  };

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
};

export const PrivateRoute: React.FC<React.PropsWithChildren<RouteProps>> = ({ children, ...rest }: RouteProps) => {
  const auth = useContext(AuthContext);

  const render = (props: RouteComponentProps): React.ReactNode => {
    const childrenWithRouteProps = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, props);
      }

      return child;
    });

    // render protected page if signed in
    if (auth.isAuthenticated) {
      return (
        <Navbar>
          {childrenWithRouteProps}
        </Navbar>
      );
    }

    // otherwise redirect to login
    return (<Redirect to={{ pathname: '/login' }} />);
  };

  return (<Route {...rest} render={render} />);
};
