import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom";

type AuthState = {
  isAuthenticated: boolean,
  signin: (cb: () => void) => void,
  signout: (cb: () => void) => void,
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

export const PrivateRoute: React.SFC<RouteProps> = ({ component, ...rest }: RouteProps) => {
  if (!component) {
    throw Error("component is undefined");
  }
  const auth = useContext(AuthContext);

  const Component = component;
  const render = (props: RouteComponentProps): React.ReactNode => {
    // render protected page if signed in
    if (auth.isAuthenticated) {
      return <Component {...props} />;
    }

    // otherwise redirect to login
    return <Redirect to={{ pathname: '/login' }} />;
  };

  return (<Route {...rest} render={render} />);
};
