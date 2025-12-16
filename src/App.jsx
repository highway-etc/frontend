import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './app.css';

const Nav = () => {
  const { pathname } = useLocation();
  const links = [
    { to: '/dashboard', label: '看板' },
    { to: '/traffic', label: '明细' },
    { to: '/alerts', label: '告警' }
  ];
  return (
    <nav className="nav">
      {links.map(l => (
        <Link key={l.to} className={pathname === l.to ? 'active' : ''} to={l.to}>{l.label}</Link>
      ))}
    </nav>
  );
};

const App = ({ children }) => (
  <div className="layout">
    <header className="header">ETC 实时看板</header>
    <Nav />
    <main className="main">{children}</main>
  </div>
);

export default App;
