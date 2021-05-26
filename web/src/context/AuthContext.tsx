import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom";
import firebase from 'firebase/app';
import 'firebase/auth';

import { Navbar } from '../components/Navbar';
import { Admin } from '../models/Admin';
import { APIContext } from './APIContext';
import { useErrorAlert } from '../hooks/useErrorAlert';

type AuthState = {
  admin: Admin | null;
  loggedIn: boolean;
  error: Error | null;
  login: (email: string, password: string, rememberMe: boolean) => void,
  logout: () => void,
  clearError: () => void,
};

const init: AuthState = {
  admin: null,
  loggedIn: false,
  error: null,
  login: () => {},
  logout: () => {},
  clearError: () => {},
};

export const AuthContext = createContext<AuthState>(init);

export const AuthProvider: React.FC = ({ children }) => {
  const api = useContext(APIContext);

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const loggedIn = admin !== null;
  const clearError = (): void => {
    setError(null);
  };

  const auth = useMemo(() => {
    const fbConfig = process.env.REACT_APP_FB_CONFIG ? JSON.parse(process.env.REACT_APP_FB_CONFIG) : {
      apiKey: process.env.REACT_APP_FB_API_KEY || 'AIzaSyBSJHJ-VfdN2Y3wC_vfD1k6bEU2mQmP-Vg',
      authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN || 'words-alive-staging.firebaseapp.com',
      projectId: process.env.REACT_APP_FB_PROJECT_ID || 'words-alive-staging',
      appId: process.env.REACT_APP_FB_APP_ID || '1:1534285739:web:2bada99614d9126d7224ee',
    };

    const app = firebase.apps[0] || firebase.initializeApp(fbConfig);
    return app.auth();
  }, []);

  useEffect(() => {
    (async () => {
      const uid = sessionStorage.getItem('userId');
      const token = sessionStorage.getItem('apiToken');
      if (uid && token) {
        api.setToken(token);
        const admin = await api.getAdmin(uid);
        setAdmin(admin);
        setError(null);
      }
    })();
  }, []);

  const login = (email: string, password: string, rememberMe: boolean): void => {
    (async () => {
      try {
        const { user: fbUser } = await auth.signInWithEmailAndPassword(email, password);
        if (fbUser === null) {
          setAdmin(null);
          setError(new Error('Firebase user does not exist'));
          return;
        }
        const uid = fbUser.uid;
        const jwt = await fbUser.getIdToken();
        api.setToken(jwt);
        sessionStorage.setItem('userId', uid);
        sessionStorage.setItem('apiToken', jwt);

        const admin = await api.getAdmin(uid);
        setAdmin(admin);
      } catch (e) {
        setError(e);
        setAdmin(null);
        auth.signOut();
      }
    })();
  };

  const logout = (): void => {
    setAdmin(null);
    setError(null);
    auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ admin, loggedIn, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export type LocationState = {
  from: string;
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
    if (auth.loggedIn) {
      return (
        <>
          <Navbar />
          {childrenWithRouteProps}
        </>
      );
    }

    // otherwise redirect to login
    return (<Redirect to={{ pathname: '/', state: { from: props.location } }} />);
  };

  return (<Route {...rest} render={render} />);
};
