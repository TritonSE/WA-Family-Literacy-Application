import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import { Communication } from '../pages/Communication';
import { Analytics } from '../pages/Analytics';
import { UploadBooks } from '../pages/UploadBooks';
import { Manage } from '../pages/Manage';
import '../css/Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <Router>
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

      <Switch>
        <Route path="/communication">
          <Communication />
        </Route>
        <Route path="/analytics">
          <Analytics />
        </Route>
        <Route path="/upload">
          <UploadBooks />
        </Route>
        <Route path="/manage">
          <Manage />
        </Route>
      </Switch>
    </Router>
  );
};
