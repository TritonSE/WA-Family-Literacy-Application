import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import './App.css';
import { CommunicationPage } from './pages/CommunicationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UploadBooksPage } from './pages/UploadBooksPage';
import { BookWizardPage } from './pages/BookWizardPage';
import { ManageAccountsPage } from './pages/ManageAccountsPage';
import { APIProvider } from './context/APIContext';

const App: React.FC = () => {
  return (
    <APIProvider>
      <Router>
        <Navbar />

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
          <Route path="/accounts">
            <ManageAccountsPage />
          </Route>
          <Route path="/wiz">
            <BookWizardPage />
          </Route>
        </Switch>
      </Router>
    </APIProvider>
  );
};

// eslint-disable-next-line import/no-default-export
export default App;
