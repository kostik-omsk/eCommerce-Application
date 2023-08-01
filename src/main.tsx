import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.tsx';
import './app/styles/global.css';

const rootElement = document.getElementById('root');
if (rootElement !== null) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
