import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import styles from './Navbar.module.css';

/**
 * This is the navbar for the application. Creates links to the routes defined
 * in App.js
 */
export const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navbar_list}>
        <li className={styles.nav_element_left}>
          <img className={styles.nav_logo} src="./img/logo.png" alt="Logo" />
        </li>
        <li className={styles.nav_element_left}>
          <NavLink className={styles.nav_link} activeClassName={styles.active} to="/communication">Communication</NavLink>
        </li>
        <li className={styles.nav_element_left}>
          <NavLink className={styles.nav_link} activeClassName={styles.active} to="/analytics">Analytics</NavLink>
        </li>
        <li className={styles.nav_element_left}>
          <NavLink className={styles.nav_link} activeClassName={styles.active} to="/books" isActive={(
            (match, location) => {
              return location.pathname == '/books/new' || location.pathname == '/books';
            })}>Upload Books</NavLink>
        </li>
        <li className={styles.nav_element_left}>
          <NavLink className={styles.nav_link} activeClassName={styles.active} to="/accounts">Manage Accounts</NavLink>
        </li>
        <li className={styles.nav_element_right}>
          <button
            className={styles.nav_button}
            type="submit" onClick={() => auth.logout()}>
            <span className={styles.button_text}>
              Sign Out
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};
