import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { List, Tag, Spin } from 'antd';
import { CarOutlined, AlertOutlined, EnvironmentOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chinaReady, setChinaReady] = useState(false);

  // Hardcoded station coordinates for demo (Guangdong area approx)
  const stationCoords = {
    101: [113.264, 23.129], // Guangzhou
    102: [114.057, 22.543], // Shenzhen
    103: [116.700, 23.392], // Shantou
    104: [113.122, 23.021], // Foshan
    105: [113.751, 23.020], // Dongguan
  };

  useEffect(() => {
    // 载入本地高精度中国 GeoJSON（public/geo/china.json）并注册
    axios.get('/geo/china.json').then(res => {
      echarts.registerMap('china', res.data);
      setChinaReady(true);
    }).catch(err => {
      console.error('Failed to load china geojson', err);
    });

    const fetchData = async () => {
      try {
        const [overviewRes, alertsRes] = await Promise.all([
          axios.get('/api/overview?windowMinutes=60'),
          axios.get('/api/alerts?size=20')
        ]);
        setOverview(overviewRes.data);
        setAlerts(alertsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !overview) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Spin size='large' /></div>;
  }

  // Chart Options
  const gaugeOption = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 10000, // Adjust based on expected traffic
      splitNumber: 5,
      itemStyle: { color: '#0ea5e9' },
      progress: { show: true, width: 18 },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 18 } },
      axisTick: { show: false },
      splitLine: { length: 12, lineStyle: { width: 2, color: '#999' } },
      axisLabel: { distance: 20, color: '#999', fontSize: 10 },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '-20%'],
        fontSize: 30,
        fontWeight: 'bolder',
        formatter: '{value}',
        color: '#fff'
      },
      data: [{ value: overview?.totalTraffic || 0, name: '车辆总数' }],
      title: { offsetCenter: [0, '20%'], fontSize: 14, color: '#94a3b8' }
    }]
  };

  const trendOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 20, bottom: 20, left: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: overview?.trafficTrend?.map(t => t.windowStart.substring(11, 16)) || [],
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8' }
    },
    series: [{
      data: overview?.trafficTrend?.map(t => t.count) || [],
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(14, 165, 233, 0.5)' },
          { offset: 1, color: 'rgba(14, 165, 233, 0.0)' }
        ])
      },
      itemStyle: { color: '#0ea5e9' }
    }]
  };

  const mapOption = {
    backgroundColor: 'transparent',
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.05,
      itemStyle: {
        areaColor: '#111827',
        borderColor: '#1f2937'
      },
      emphasis: {
        itemStyle: {
          areaColor: '#0ea5e9'
        }
      }
    },
    series: chinaReady ? [
      {
        type: 'map',
        map: 'china',
        roam: true,
        label: { show: false },
        itemStyle: {
          borderColor: '#334155',
          borderWidth: 1,
          areaColor: 'rgba(30,41,59,0.6)'
        }
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: overview?.topStations?.map(s => {
          const coords = stationCoords[s.stationId] || [113.264, 23.129];
          return { name: `站点 ${s.stationId}`, value: [...coords, s.count] };
        }) || [],
        symbolSize: val => Math.min((val[2] || 0) / 20 + 10, 28),
        itemStyle: { color: '#f43f5e', shadowBlur: 10, shadowColor: '#f43f5e' },
        label: { show: true, formatter: '{b}', color: '#e2e8f0' }
      }
    ] : []
  };

  const topStationOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Top Stations',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 5, borderColor: '#151e32', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold', color: '#fff' } },
        labelLine: { show: false },
        data: overview?.topStations?.map(s => ({ value: s.count, name: `Station ${s.stationId}` })) || []
      }
    ]
  };

  return (
    <div className='dashboard-grid'>
      {/* Left Panel */}
      <div className='panel'>
        <div className='panel-title'>数据总览</div>
        <div style={{ height: '200px' }}>
          <ReactECharts option={gaugeOption} style={{ height: '100%', width: '100%' }} />
        </div>
        
        <div className='stat-card'>
          <div>
            <div className='stat-label'>去重车牌数</div>
            <div className='stat-value'>{overview?.uniquePlates || 0}</div>
          </div>
          <CarOutlined style={{ fontSize: '24px', color: '#38bdf8', opacity: 0.5 }} />
        </div>

        <div className='stat-card'>
          <div>
            <div className='stat-label'>告警总数</div>
            <div className='stat-value' style={{ color: '#f43f5e' }}>{overview?.alertCount || 0}</div>
          </div>
          <AlertOutlined style={{ fontSize: '24px', color: '#f43f5e', opacity: 0.5 }} />
        </div>

        <div className='panel-title' style={{ marginTop: '20px' }}>出站站点总览</div>
        <div style={{ flex: 1 }}>
          <ReactECharts option={topStationOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Center Panel */}
      <div className='panel' style={{ padding: 0, background: 'radial-gradient(circle at center, #1e293b 0%, #0b1120 100%)' }}>
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
          <div className='panel-title'>来深车辆来源</div>
        </div>
        <ReactECharts option={mapOption} style={{ height: '100%', width: '100%' }} />
        
        {/* Bottom Trend Chart in Center */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, #0b1120, transparent)', padding: '20px' }}>
           <div className='panel-title' style={{ fontSize: '14px' }}>24小时车辆情况</div>
           <ReactECharts option={trendOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Right Panel */}
      <div className='panel'>
        <div className='panel-title'>
          <span className='live-indicator'></span>
          实时告警监控
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <List
            dataSource={alerts}
            renderItem={(item) => (
              <List.Item style={{ padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
                <List.Item.Meta
                  avatar={<AlertOutlined style={{ color: '#f43f5e', fontSize: '20px' }} />}
                  title={<span style={{ color: '#e2e8f0' }}>{item.licensePlate}</span>}
                  description={<span style={{ color: '#94a3b8', fontSize: '12px' }}>{item.timestamp.replace('T', ' ')}</span>}
                />
                <Tag color='error'>{item.alertType || '套牌'}</Tag>
              </List.Item>
            )}
          />
        </div>
        
        <div className='panel-title' style={{ marginTop: '20px' }}>数据统计图</div>
        <div style={{ height: '200px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px' }}>
           {/* Placeholder for another chart or info */}
           <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>
             站点名称: 罗田主线站<br/>
             流量告警值: 24.00<br/>
             当前状态: <span style={{ color: '#22c55e' }}>正常</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;