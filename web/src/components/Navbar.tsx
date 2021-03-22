import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import { Communication } from '../pages/Communication';
import { Analytics } from '../pages/Analytics';
import { UploadBooks } from '../pages/UploadBooks';
import { Manage } from '../pages/Manage';

export const Navbar: React.FC = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/communication">Communication</Link>
            </li>
            <li>
              <Link to="/analytics">Analytics</Link>
            </li>
            <li>
              <Link to="/upload">Upload Books</Link>
            </li>
            <li>
              <Link to="/manage">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          {/* <Route path="/">
            <Home />
          </Route> */}
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
      </div>
    </Router>
  );
};

// const Home: any = () => {
//   return <h2>Home</h2>;
// };
