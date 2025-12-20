import React from 'react';
import { Button, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, RocketOutlined, SafetyCertificateOutlined, BarChartOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-bg"></div>
      <div className="hero-section">
        <div className="hero-content">
          <Title level={1} style={{ color: '#fff', fontSize: '48px', marginBottom: '24px' }}>
            高速公路 ETC 大数据分析平台
          </Title>
          <Paragraph style={{ color: '#cbd5e1', fontSize: '20px', marginBottom: '40px' }}>
            基于 Flink + Kafka + MyCat 的实时与离线全栈交通数据处理方案
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              icon={<ArrowRightOutlined />} 
              onClick={() => navigate('/dashboard')}
              style={{ height: '50px', padding: '0 32px', fontSize: '18px' }}
            >
              进入控制台
            </Button>
            <Button 
              ghost 
              size="large" 
              onClick={() => navigate('/analysis')}
              style={{ height: '50px', padding: '0 32px', fontSize: '18px' }}
            >
              查看分析报告
            </Button>
          </Space>
        </div>
        <div className="hero-image-wrapper">
          <img src="/img/hero-bg.jpg" alt="ETC System" className="hero-image" />
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <RocketOutlined className="feature-icon" />
          <Title level={3} style={{ color: '#fff' }}>实时流处理</Title>
          <Text style={{ color: '#94a3b8' }}>利用 Apache Flink 实现毫秒级交通流量统计与异常告警。</Text>
        </div>
        <div className="feature-card">
          <SafetyCertificateOutlined className="feature-icon" />
          <Title level={3} style={{ color: '#fff' }}>交互式查询</Title>
          <Text style={{ color: '#94a3b8' }}>支持海量通行记录的秒级检索，精准定位车辆轨迹。</Text>
        </div>
        <div className="feature-card">
          <BarChartOutlined className="feature-icon" />
          <Title level={3} style={{ color: '#fff' }}>离线深度分析</Title>
          <Text style={{ color: '#94a3b8' }}>对历史数据进行多维钻取，挖掘交通拥堵规律与趋势。</Text>
        </div>
      </div>

      <footer className="home-footer">
        <div className="footer-divider"></div>
        <div className="footer-content">
          <div className="footer-info">
            <Text style={{ color: '#94a3b8' }}>作者：<span style={{ color: '#38bdf8' }}>BLueCatの夏天</span></Text>
            <Space size="middle">
              <a href="mailto:cangr_n19771222@163.com" className="footer-link">
                <MailOutlined /> cangr_n19771222@163.com
              </a>
              <a href="https://github.com/highway-etc" target="_blank" rel="noopener noreferrer" className="footer-link">
                <GithubOutlined /> GitHub
              </a>
            </Space>
          </div>
          <div className="footer-license">
            <Text style={{ color: '#64748b', fontSize: '12px' }}>
              © 2025 Highway ETC Big Data Platform. 基于 MIT 协议开源。
            </Text>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
