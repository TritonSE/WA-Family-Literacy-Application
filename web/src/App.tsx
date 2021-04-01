import React from 'react';

import './App.css';
import { UploadBooksPage } from './pages/UploadBooksPage';

const App: React.FC = () => {
  return (
    <div className="App">
      <UploadBooksPage />
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default App;
