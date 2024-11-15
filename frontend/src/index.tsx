// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      {/* Wrap the App with Router to enable routing */}
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);

// Service worker registration (for PWA functionality)
serviceWorkerRegistration.register();

// Web Vitals (for performance monitoring)
reportWebVitals();
