import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.css';
/**
 * This is the navbar for the application. Creates links to the routes defined
 * in App.js
 */
export const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <img src="./img/logo.png" alt="Logo" />
        </li>
        <li>
          <NavLink activeClassName="active" to="/communication">Communication</NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/analytics">Analytics</NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/upload">Upload Books</NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/manage">Manage</NavLink>
        </li>
        <li className="sign_out">
          <button type="submit"><span>Sign Out</span></button>
        </li>
      </ul>
    </nav>
  );
};
