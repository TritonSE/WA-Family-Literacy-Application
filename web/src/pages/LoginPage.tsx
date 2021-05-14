import React, { useState, useContext } from 'react';
import {
  useHistory,
} from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();
  const auth = useContext(AuthContext);
  const { from } = { from: { pathname: "/communication" } };

  return (
    <div className={styles.parent}>
      <div className={styles.loginContainer}>
        <img className={styles.loginLogo} src="./img/logo.png" alt="Logo" />
        <form className={styles.loginForm}>
          <input onChange={e => setUsername(e.target.value)} className={styles.loginInput} required placeholder="Username" type="text"></input>
          <input onChange={e => setPassword(e.target.value)} className={styles.loginInput} required placeholder="Password" type="password"></input>
          <button className={styles.loginBtn} type="button" onClick={() => auth.signin(() => history.replace(from))}>Login</button>
          {username}
          {password}
        </form>
      </div>
    </div>
  );
};
