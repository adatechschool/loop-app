// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react"; // ChakraProvider pour appliquer le thème
import App from "./App";
import theme from "./theme"; // Importez votre fichier de thème personnalisé
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      {/* Enveloppez l'application avec Router pour activer la gestion des routes */}
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);

// Enregistrement du service worker (fonctionnalité PWA)
serviceWorkerRegistration.register();

// Web Vitals (pour surveiller la performance)
reportWebVitals();
