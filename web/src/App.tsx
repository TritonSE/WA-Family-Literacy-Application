import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import './App.css';
import { CommunicationPage } from './pages/CommunicationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UploadBooksPage } from './pages/UploadBooksPage';
import { ManagePage } from './pages/ManagePage';
import { BookWizardPage } from './pages/BookWizardPage';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar/>

      <Switch>
        <Route path="/communication">
          <CommunicationPage/>
        </Route>
        <Route path="/analytics">
          <AnalyticsPage/>
        </Route>
        <Route path="/upload">
          <UploadBooksPage/>
        </Route>
        <Route path="/manage">
          <ManagePage/>
        </Route>
        <Route path="/wiz">
          <BookWizardPage/>
        </Route>
      </Switch>
    </Router>
  );
};

// eslint-disable-next-line import/no-default-export
export default App;
