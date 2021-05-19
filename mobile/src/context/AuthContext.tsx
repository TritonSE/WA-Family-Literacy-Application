import React, { createContext, useContext, useMemo, useState } from 'react';
import Constants from 'expo-constants';
import firebase from 'firebase/app';
import 'firebase/auth';

import { User } from '../models/User';
import { APIContext } from './APIContext';

type AuthState = {
  user: User | null;
  loggedIn: boolean;
  isGuest: boolean;
  error: Error | null;
  login: (email: string, password: string, rememberMe: boolean) => void,
  signup: (name: string, email: string, password: string, inSanDiego: boolean) => void,
  logout: () => void,
  continueAsGuest: () => void,
};

const init: AuthState = {
  user: null,
  loggedIn: false,
  isGuest: false,
  error: null,
  login: () => {},
  logout: () => {},
  signup: () => {},
  continueAsGuest: () => {},
};

export const AuthContext = createContext<AuthState>(init);

export const AuthProvider: React.FC = ({ children }) => {
  const api = useContext(APIContext);

  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const loggedIn = user !== null || isGuest;

  const auth = useMemo(() => {
    const app = firebase.apps[0] || firebase.initializeApp(Constants.manifest.extra.firebase);
    return app.auth();
  }, []);

  const login = (email: string, password: string): void => {
    (async () => {
      try {
        const { user: fbUser } = await auth.signInWithEmailAndPassword(email, password);
        const jwt = await fbUser.getIdToken();
        api.setToken(jwt);

        const uid = fbUser.uid;
        const user = await api.getUser(uid);
        setUser(user);
      } catch (e) {
        setError(e);
        setUser(null);
      }
    })();
  };

  const signup = (name: string, email: string, password: string, inSanDiego: boolean): void => {
    (async () => {
      try {
        const { user: fbUser } = await auth.createUserWithEmailAndPassword(email, password);
        const jwt = await fbUser.getIdToken();
        api.setToken(jwt);

        const uid = fbUser.uid;
        const user = await api.createUser({
          id: uid,
          email: email,
          name: name,
          in_san_diego: inSanDiego,
        });

        setUser(user);
      } catch (e) {
        setError(e);
        setUser(null);
      }
    })();
  };

  const logout = (): void => {
    api.clearToken();
    setError(null);
    setUser(null);
    setIsGuest(false);
  };

  const continueAsGuest = (): void => {
    setIsGuest(true);
  };

  return (<AuthContext.Provider
    value={{ user, isGuest, loggedIn, error, login, logout, signup, continueAsGuest }}
  >
    {children}
  </AuthContext.Provider>);
};
