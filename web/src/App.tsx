import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import { LoginPage } from './pages/LoginPage';
import { CommunicationPage } from './pages/CommunicationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UploadBooksPage } from './pages/UploadBooksPage';
import { BookWizardPage } from './pages/BookWizardPage';
import { ManageAccountsPage } from './pages/ManageAccountsPage';
import { APIProvider } from './context/APIContext';
import { PrivateRoute, AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <APIProvider>
      <AuthProvider>
        <Router>
          <Switch>
            <PrivateRoute path="/communication">
              <CommunicationPage />
            </PrivateRoute>
            <PrivateRoute path="/analytics">
              <AnalyticsPage />
            </PrivateRoute>
            <PrivateRoute exact path="/books">
              <UploadBooksPage />
            </PrivateRoute>
            <PrivateRoute exact path="/books/new">
              <BookWizardPage />
            </PrivateRoute>
            <PrivateRoute path="/books/:id">
              <BookWizardPage />
            </PrivateRoute>
            <PrivateRoute path="/accounts">
              <ManageAccountsPage />
            </PrivateRoute>
            <Route path="/">
              <LoginPage />
            </Route>
          </Switch>
        </Router>
      </AuthProvider>
    </APIProvider>
  );
};

// eslint-disable-next-line import/no-default-export
export default App;
