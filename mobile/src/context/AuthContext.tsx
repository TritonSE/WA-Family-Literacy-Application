import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Constants from 'expo-constants';
import firebase from 'firebase/app';
import 'firebase/auth';
import * as SecureStore from 'expo-secure-store';

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
  fetchUser: () => void,
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
  fetchUser: () => {},
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

  useEffect(() => {
    (async () => {
      try {
        const [userJSON, token] = await Promise.all([SecureStore.getItemAsync('user'), SecureStore.getItemAsync('apiToken')]);
        if (userJSON && token) {
          const user = JSON.parse(userJSON) as User;
          api.setToken(token);
          setUser(user);
        }
      } catch (e) {
        // Don't set error state var, ignore, user can just re-login
        console.log(e.message);
      }
    })();
  }, [auth]);

  const login = (email: string, password: string, rememberMe: boolean): void => {
    (async () => {
      try {
        const { user: fbUser } = await auth.signInWithEmailAndPassword(email, password);
        if (fbUser === null) {
          setError(new Error('User does not exist'));
          setUser(null);
          return;
        }
        const jwt = await fbUser.getIdToken();
        api.setToken(jwt);

        const uid = fbUser.uid;
        const user = await api.getUser(uid);
        setUser(user);

        if (rememberMe) {
          await Promise.all([SecureStore.setItemAsync('user', JSON.stringify(user)), SecureStore.setItemAsync('apiToken', jwt)]);
        }
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
        if (fbUser === null) {
          setError(new Error('Unknown error creating user'));
          setUser(null);
          return;
        }
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

  const fetchUser = (): void => {
    (async () => {
      try {
        const apiUser = await api.getUser(user.id);
        setUser(apiUser);
      } catch (e) {
        setError(e);
        setUser(null);
      }
    })();
  }

  return (<AuthContext.Provider
    value={{ user, isGuest, loggedIn, error, login, logout, signup, continueAsGuest, fetchUser }}
  >
    {children}
  </AuthContext.Provider>);
};
