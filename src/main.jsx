import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Traffic from './pages/Traffic';
import Alerts from './pages/Alerts';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/traffic" element={<Traffic />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </App>
    </BrowserRouter>
  </React.StrictMode>
);
