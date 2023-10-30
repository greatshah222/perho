import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'; // HashRouter, basename //app to router // BrowserRouter
import StateHolder from './contexts/StateHolder';
import ContextFunctions from './contexts/ContextFunctions';
import './i18n/config';
import ScrollToTop from './components/ScrollToTop';
import { CookiesProvider } from 'react-cookie';
import { HelmetProvider } from 'react-helmet-async';

const helmetContext = {};

console.log = function () {}; // Disable all console.logs from console

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <CookiesProvider>
        <HelmetProvider context={helmetContext}>
          <StateHolder>
            <ContextFunctions>
              <ScrollToTop />
              <App />
            </ContextFunctions>
          </StateHolder>
        </HelmetProvider>
      </CookiesProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
