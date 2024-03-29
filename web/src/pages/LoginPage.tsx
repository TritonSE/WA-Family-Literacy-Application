import React, { useState, useContext } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { AuthContext, LocationState } from '../context/AuthContext';

import styles from './LoginPage.module.css';
import { useErrorAlert } from '../hooks/useErrorAlert';

export const LoginPage: React.FC = () => {
  const location = useLocation<LocationState>();
  const auth = useContext(AuthContext);
  useErrorAlert(auth.error, auth.clearError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const login = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    auth.login(email, password, rememberMe);
  };

  if (auth.admin !== null) {
    const defaultLocation = auth.admin.can_upload_books ? '/books' : '/accounts';
    return <Redirect to={ location.state?.from ?? defaultLocation } />;
  }

  return (
    <div className={styles.parent}>
      <div className={styles.loginContainer}>
        <img className={styles.loginLogo} src="./img/logo.png" alt="Logo" />
        <form className={styles.loginForm} onSubmit={login}>
          <input onChange={e => setEmail(e.target.value)} className={styles.loginInput} autoFocus required placeholder="Email Address" type="text" />
          <input onChange={e => setPassword(e.target.value)} className={styles.loginInput} required placeholder="Password" type="password" />
          <button className={styles.loginBtn} type="submit">Login</button>
          <label className={styles.checkbox} htmlFor="rememberMe">
            <span className={styles.rememberMeLabel}>Remember me</span>
            <input id="rememberMe" type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
            <span className={styles.checkmark} />
          </label>
        </form>
      </div>
    </div>
  );
};
