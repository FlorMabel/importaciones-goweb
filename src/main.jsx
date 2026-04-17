import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from './context/StoreContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import App from './App.jsx';
import './style.css';

import { CookieConsentProvider } from './context/CookieConsentContext.jsx';
import CookieBanner from './components/CookieBanner.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <CookieConsentProvider>
          <StoreProvider>
            <ToastProvider>
              <App />
              <CookieBanner />
            </ToastProvider>
          </StoreProvider>
        </CookieConsentProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
