import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
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
      </ul>
    </nav>
  );
};
