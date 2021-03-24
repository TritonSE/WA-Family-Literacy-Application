import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import './App.css';
import { Communication } from './pages/Communication';
import { Analytics } from './pages/Analytics';
import { UploadBooks } from './pages/UploadBooks';
import { Manage } from './pages/Manage';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar/>

      <Switch>
        <Route path="/communication">
          <Communication/>
        </Route>
        <Route path="/analytics">
          <Analytics/>
        </Route>
        <Route path="/upload">
          <UploadBooks/>
        </Route>
        <Route path="/manage">
          <Manage/>
        </Route>
      </Switch>
    </Router>
  );
};

// eslint-disable-next-line import/no-default-export
export default App;
