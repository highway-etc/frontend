import React, { useEffect, useRef } from 'react';
import { Button, Typography, Space, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, RocketOutlined, SafetyCertificateOutlined, BarChartOutlined, GithubOutlined, MailOutlined, ClusterOutlined, PartitionOutlined, DatabaseOutlined, ThunderboltOutlined, DownOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const overviewRef = useRef(null);

  const scrollToOverview = () => {
    overviewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <div className="home-bg"></div>
      
      {/* Hero Section */}
      <div className="hero-section page-fade-in">
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
          
          <div className="scroll-hint" onClick={scrollToOverview} style={{ marginTop: '60px', cursor: 'pointer', textAlign: 'center' }}>
            <Text style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>了解系统架构</Text>
            <DownOutlined style={{ color: '#38bdf8', fontSize: '20px', animation: 'bounce 2s infinite' }} />
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img src="/img/hero-bg.jpg" alt="ETC System" className="hero-image" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-grid page-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="feature-card" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <RocketOutlined className="feature-icon" />
          <Title level={3} style={{ color: '#fff' }}>实时流处理</Title>
          <Paragraph style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
            基于 Apache Flink 构建的高吞吐流式计算引擎，能够以毫秒级延迟处理海量交通数据。内置复杂的 CEP 规则引擎，实时识别套牌、异常路径等风险行为，保障高速公路运营安全。
          </Paragraph>
        </div>
        <div className="feature-card" onClick={() => navigate('/query')} style={{ cursor: 'pointer' }}>
          <SafetyCertificateOutlined className="feature-icon" />
          <Title level={3} style={{ color: '#fff' }}>交互式查询</Title>
          <Paragraph style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
            依托 MyCat 分布式数据库架构，实现亿级数据量的秒级检索。支持按车牌、时间、站点等多维度组合查询，精准还原车辆通行轨迹，为稽核追缴提供强有力的数据支撑。
          </Paragraph>
        </div>
        <div className="feature-card" onClick={() => navigate('/analysis')} style={{ cursor: 'pointer' }}>
          <BarChartOutlined className="feature-icon" />
          <Title level={3} style={{ color: '#fff' }}>离线深度分析</Title>
          <Paragraph style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
            整合历史全量数据，运用大数据挖掘算法进行多维钻取分析。从车流量趋势、车型构成到拥堵规律，全方位洞察交通运行态势，辅助管理部门进行科学决策与规划。
          </Paragraph>
        </div>
      </div>

      {/* System Overview Section (Merged) */}
      <div ref={overviewRef} className="system-overview-section" style={{ padding: '60px 20px', background: '#0b1120' }}>
        <div className="section-card page-fade-in" style={{ maxWidth: '1200px', margin: '0 auto 40px' }}>
          <div className="section-header">
            <div>
              <div className="section-eyebrow">System Architecture</div>
              <div className="section-title">系统全览与架构设计</div>
            </div>
            <div className="pill-row">
              <span className="pill">实时流</span>
              <span className="pill">离线分析</span>
              <span className="pill">可视化</span>
            </div>
          </div>
          <div className="section-subtitle">
            本平台是一套覆盖数据采集、实时处理、分布式存储、微服务接口及前端可视化的端到端企业级大数据解决方案。我们攻克了海量数据并发写入、实时风控规则动态计算及跨库跨表复杂查询等技术难题，构建了高可用、高扩展的智能交通数据中台。
          </div>
        </div>

        <div className="system-grid three-col" style={{ maxWidth: '1200px', margin: '0 auto 40px' }}>
          <div className="system-tile">
            <div className="tile-title"><ClusterOutlined /> 实时计算引擎</div>
            <Paragraph style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '14px' }}>
              核心计算层基于 Apache Flink 构建，我们精心设计了复杂的事件处理拓扑，以应对高速公路海量并发的通行数据。通过自定义的时间窗口策略与状态管理机制，系统能够在毫秒级别内完成数据清洗、去重以及异常行为（如套牌车）的实时识别，确保了数据在进入存储层之前的高质量与准确性。此外，我们引入了动态配置广播流，实现了风控规则的热更新，无需重启作业即可应对新的业务需求。
            </Paragraph>
          </div>
          <div className="system-tile">
            <div className="tile-title"><DatabaseOutlined /> 分布式存储架构</div>
            <Paragraph style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '14px' }}>
              面对每日亿级的数据增量，我们采用了 MyCat 中间件构建了高可用的分布式存储架构。针对交通数据的时空查询特性，我们设计了基于省份代码与车牌前缀的复合分片策略，这不仅实现了物理节点间的负载均衡，更保证了在海量数据背景下的秒级查询响应。同时，我们实施了严格的冷热数据分离策略，将高频访问的热数据驻留内存与高速存储，历史冷数据自动归档，实现了性能与成本的最优平衡。
            </Paragraph>
          </div>
          <div className="system-tile">
            <div className="tile-title"><PartitionOutlined /> 微服务与可视化</div>
            <Paragraph style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '14px' }}>
              应用层由 Spring Boot 微服务集群支撑，作为连接底层数据与用户洞察的桥梁。我们实现了全套 RESTful API，不仅能够实时推送聚合指标，还能灵活调度复杂的离线分析任务。前端采用 React 与 Ant Design 深度定制，通过 WebSocket 消费告警流，为运营人员提供了一个直观、动态且响应迅速的指挥中心。结合 ECharts 高性能渲染引擎，我们实现了百万级轨迹点的流畅展示，让数据真正“看得见、摸得着”。
            </Paragraph>
          </div>
        </div>

        <div className="section-card" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-header">
            <ThunderboltOutlined className="section-icon" />
            <div className="section-title">全链路数据流转图谱</div>
          </div>
          
          <div className="flow-container" style={{ padding: '40px 20px', background: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
            {/* Top Row: Ingestion */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div className="flow-node" style={{ background: '#1e293b', padding: '15px 25px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: '5px' }}>RSU / OBU</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>边缘采集设备</div>
              </div>
              <ArrowRightOutlined style={{ color: '#475569', fontSize: '20px' }} />
              <div className="flow-node" style={{ background: '#1e293b', padding: '15px 25px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: '5px' }}>Nginx Gateway</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>负载均衡 / 鉴权</div>
              </div>
              <ArrowRightOutlined style={{ color: '#475569', fontSize: '20px' }} />
              <div className="flow-node" style={{ background: '#1e293b', padding: '15px 25px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: '5px' }}>Kafka Cluster</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>高吞吐消息缓冲</div>
              </div>
            </div>

            {/* Middle Row: Processing */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', justifyContent: 'center', position: 'relative' }}>
               <div style={{ position: 'absolute', top: '-40px', left: '50%', width: '2px', height: '40px', background: '#334155', transform: 'translateX(-50%)' }}></div>
               
               <div className="flow-node" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '20px 30px', borderRadius: '8px', border: '1px solid #0ea5e9', textAlign: 'center', minWidth: '220px', boxShadow: '0 0 20px rgba(14, 165, 233, 0.2)' }}>
                <div style={{ color: '#0ea5e9', fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>Flink Streaming Engine</div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>ETL / Watermark / Windowing</div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>CEP Pattern Matching</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <div className="flow-node" style={{ background: '#1e293b', padding: '10px 20px', borderRadius: '6px', border: '1px dashed #64748b', textAlign: 'center' }}>
                    <div style={{ color: '#cbd5e1', fontSize: '12px' }}>Redis (Cache)</div>
                 </div>
                 <div className="flow-node" style={{ background: '#1e293b', padding: '10px 20px', borderRadius: '6px', border: '1px dashed #64748b', textAlign: 'center' }}>
                    <div style={{ color: '#cbd5e1', fontSize: '12px' }}>MySQL (Dim)</div>
                 </div>
              </div>
            </div>

            {/* Bottom Row: Storage & Serving */}
            <div style={{ display: 'flex', gap: '80px', position: 'relative', marginTop: '10px' }}>
               {/* Lines from Flink */}
               <div style={{ position: 'absolute', top: '-50px', left: '50%', width: '2px', height: '50px', background: '#334155', transform: 'translateX(-50%)' }}></div>
               <div style={{ position: 'absolute', top: '-20px', left: '20%', width: '30%', height: '2px', background: '#334155' }}></div>
               <div style={{ position: 'absolute', top: '-20px', right: '20%', width: '30%', height: '2px', background: '#334155' }}></div>
               <div style={{ position: 'absolute', top: '-20px', left: '20%', width: '2px', height: '20px', background: '#334155' }}></div>
               <div style={{ position: 'absolute', top: '-20px', right: '20%', width: '2px', height: '20px', background: '#334155' }}></div>

              <div className="flow-node" style={{ background: '#1e293b', padding: '15px 25px', borderRadius: '8px', border: '1px solid #f43f5e', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ color: '#f43f5e', fontWeight: 'bold', marginBottom: '5px' }}>Alert Channel</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>WebSocket / Push</div>
              </div>
              <div className="flow-node" style={{ background: '#1e293b', padding: '15px 25px', borderRadius: '8px', border: '1px solid #10b981', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '5px' }}>MyCat Cluster</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>Sharding / HA</div>
              </div>
              <div className="flow-node" style={{ background: '#1e293b', padding: '15px 25px', borderRadius: '8px', border: '1px solid #818cf8', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ color: '#818cf8', fontWeight: 'bold', marginBottom: '5px' }}>Data Warehouse</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>Hive / Spark</div>
              </div>
            </div>
          </div>
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
