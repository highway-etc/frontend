import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DashboardOutlined, TableOutlined, AlertOutlined, CloudServerOutlined } from '@ant-design/icons';
import './app.css';

const App = ({ children }) => {
  const { pathname } = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: '数据大屏', icon: <DashboardOutlined /> },
    { path: '/traffic', label: '离线分析', icon: <TableOutlined /> },
    { path: '/alerts', label: '交互式查询', icon: <AlertOutlined /> }
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <CloudServerOutlined style={{ fontSize: '28px', color: '#38bdf8' }} />
          <span>ETC BIGDATA STORAGE</span>
        </div>
        <nav className="nav-menu">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ color: '#94a3b8', fontSize: '14px', fontFamily: 'monospace' }}>
          {new Date().toISOString().split('T')[0]}
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default App;