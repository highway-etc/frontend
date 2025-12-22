import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Query from './pages/Query';
import Analysis from './pages/Analysis';
import SystemOverview from './pages/SystemOverview';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/query" element={<Query />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/system" element={<SystemOverview />} />
        </Routes>
      </App>
    </BrowserRouter>
  </React.StrictMode>
);
