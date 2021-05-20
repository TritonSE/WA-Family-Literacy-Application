import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
/**
 * This is the navbar for the application. Creates links to the routes defined
 * in App.js
 */
export const Navbar: React.FC = () => {
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
              if (location.pathname == "/books/new" || location.pathname=="/books")
                return true;
              return false;
            }
          )}>Upload Books</NavLink>
        </li>
        <li className={styles.nav_element_left}>
          <NavLink className={styles.nav_link} activeClassName={styles.active} to="/accounts">Manage Accounts</NavLink>
        </li>
        <li className={styles.nav_element_right}>
          <button className={styles.nav_button} type="submit"><span className={styles.button_text}>Sign Out</span></button>
        </li>
      </ul>
    </nav>
  );
};
