import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, DashboardOutlined, SearchOutlined, BarChartOutlined, CloudServerOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import './app.css';

const App = ({ children }) => {
  const { pathname } = useLocation();
  
  const navItems = [
    { path: '/', label: '首页', icon: <HomeOutlined /> },
    { path: '/dashboard', label: '数据大屏', icon: <DashboardOutlined /> },
    { path: '/query', label: '交互式查询', icon: <SearchOutlined /> },
    { path: '/analysis', label: '离线分析', icon: <BarChartOutlined /> },
    { path: '/system', label: '系统全览', icon: <DeploymentUnitOutlined /> }
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <CloudServerOutlined style={{ fontSize: '28px', color: '#38bdf8' }} />
            <span>ETC BIGDATA STORAGE</span>
          </div>
        </div>
        <nav className="nav-menu nav-centered">
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
        <div className="header-right">
          <div className="date-chip">{new Date().toISOString().split('T')[0]}</div>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default App;