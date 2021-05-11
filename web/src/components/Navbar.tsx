import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
/**
 * This is the navbar for the application. Creates links to the routes defined
 * in App.js
 */
export const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="navbar_list">

        <li className="nav_element_left">
          <img className="nav_logo" src="./img/logo.png" alt="Logo" />
        </li>
        <li className="nav_element_left">
          <NavLink className="body3 nav_link" activeClassName="active" to="/communication">Communication</NavLink>
        </li>
        <li className="nav_element_left">
          <NavLink className="body3 nav_link" activeClassName="active" to="/analytics">Analytics</NavLink>
        </li>
        <li className="nav_element_left">
          <NavLink className="body3 nav_link" activeClassName="active" to="/books">Upload Books</NavLink>
        </li>
        <li className="nav_element_left">
          <NavLink className="body3 nav_link" activeClassName="active" to="/accounts">Manage</NavLink>
        </li>
        <li className="nav_element_right">
          <button className="nav_button" type="submit"><span className="body3 button_text">Sign Out</span></button>
        </li>
      </ul>
    </nav>
  );
};
