import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';
import { CommunicationPage } from '../pages/CommunicationPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { UploadBooksPage } from '../pages/UploadBooksPage';
import { ManagePage } from '../pages/ManagePage';
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
          <CommunicationPage />
        </Route>
        <Route path="/analytics">
          <AnalyticsPage />
        </Route>
        <Route path="/upload">
          <UploadBooksPage />
        </Route>
        <Route path="/manage">
          <ManagePage />
        </Route>
      </Switch>
    </Router>
  );
};
