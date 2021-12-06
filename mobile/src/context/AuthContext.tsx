import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as FB from 'firebase/app';
import * as FBA from 'firebase/auth';

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
  clearError: () => void,
  sendPasswordResetEmail: (email: string, showModal: () => void ) => void,
};

const init: AuthState = {
  user: null,
  loggedIn: false,
  isGuest: false,
  error: null,
  login: () => { },
  logout: () => { },
  signup: () => { },
  continueAsGuest: () => { },
  fetchUser: () => { },
  clearError: () => { },
  sendPasswordResetEmail: () => { },
};

export const AuthContext = createContext<AuthState>(init);

export const AuthProvider: React.FC = ({ children }) => {
  const api = useContext(APIContext);

  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const loggedIn = user !== null || isGuest;
  const clearError = (): void => {
    setError(null);
  };

  const auth = useMemo(() => {
    const app = FB.getApps()[0] || FB.initializeApp(Constants.manifest?.extra?.firebase);
    return FBA.getAuth(app);
  }, []);

  // In general, when Firebase's internal user state updates we want to be notified
  // so we can fetch the user from the backend, set the API token, etc.
  // But when registering a new account, we need to briefly unregister this listener
  // so we can create the backend profile, or the api.getUser() will fail with a 404
  let unsubscribe: FBA.Unsubscribe | null = null;
  const subscribeToAuth = (): void => {
    unsubscribe = FBA.onAuthStateChanged(auth, async (fbUser: FBA.User | null) => {
      if (fbUser === null) {
        setUser(null);
        AsyncStorage.removeItem('USER');
        return;
      }

      const { uid } = fbUser;

      try {
        const token = await FBA.getIdToken(fbUser);
        api.setToken(token);

        const user = await api.getUser(uid);
        setUser(user);
        if (rememberMe) {
          AsyncStorage.setItem('USER', JSON.stringify(user));
        }
      } catch (e) {
        setError(e);
        setUser(null);
        AsyncStorage.removeItem('USER');
      }
    });
  };

  useEffect(subscribeToAuth, [auth]);

  // For offline support, check if we have a cached user object and use it.
  // If we are online, Firebase will refetch and overwrite the user var if needed
  useEffect(() => {
    (async () => {
      const userJSON = await AsyncStorage.getItem('USER');
      if (userJSON) {
        setUser(JSON.parse(userJSON) as User);
      }
    })();
  }, []);

  const login = (email: string, password: string, rememberMe: boolean): void => {
    (async () => {
      try {
        setRememberMe(rememberMe);
        // Firebase will auto-save credentials locally, turn this off if rememberMe is unchecked
        if (!rememberMe) {
          await FBA.setPersistence(auth, FBA.inMemoryPersistence);
        }
        await FBA.signInWithEmailAndPassword(auth, email, password);
        // will automatically call onAuthStateChanged, fetching the token, profile info, etc.
      } catch (e) {
        setError(e);
        setUser(null);
        AsyncStorage.removeItem('USER');
      }
    })();
  };

  const logout = (): void => {
    FBA.signOut(auth);
    setError(null);
    setUser(null);
    AsyncStorage.removeItem('USER');
    setIsGuest(false);
  };

  const continueAsGuest = (): void => {
    setIsGuest(true);
  };

  const signup = (name: string, email: string, password: string, inSanDiego: boolean): void => {
    (async () => {
      try {
        // Don't let Firebase try to auto-login, we need to create the backend user first
        if (unsubscribe !== null) unsubscribe();

        const { user: fbUser } = await FBA.createUserWithEmailAndPassword(auth, email, password);
        if (fbUser === null) {
          setError(new Error('Error signing up, please try again'));
          setUser(null);
          AsyncStorage.removeItem('USER');
          return;
        }
        const jwt = await fbUser.getIdToken();
        api.setToken(jwt);

        await api.createUser({
          id: fbUser.uid,
          email: email,
          name: name,
          in_san_diego: inSanDiego,
        });

        // Good to go now, resubscribe to auth events
        subscribeToAuth();
      } catch (e) {
        setError(e);
        setUser(null);
        AsyncStorage.removeItem('USER');
      }
    })();
  };

  const sendPasswordResetEmail = (email: string, showModal: () => void): void => {
    (async () => {
      try {
        await FBA.sendPasswordResetEmail(auth, email);
        showModal();
      } catch (e) {
        setError(new Error('Invalid Email Address'));
      }
    })();
  };

  const fetchUser = (): void => {
    if (user === null) return;

    (async () => {
      try {
        const apiUser = await api.getUser(user.id);
        setUser(apiUser);
        if (rememberMe) {
          AsyncStorage.setItem('USER', JSON.stringify(user));
        }
      } catch (e) {
        setError(e);
        setUser(null);
        AsyncStorage.removeItem('USER');
      }
    })();
  };

  return (<AuthContext.Provider
    value={{ user, isGuest, loggedIn, error, login, logout, signup, continueAsGuest, fetchUser, clearError, sendPasswordResetEmail }}
  >
    {children}
  </AuthContext.Provider>);
};
