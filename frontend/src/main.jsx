// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css'; // Verifica que la ruta sea correcta
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

