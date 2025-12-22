import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Space, Card, Statistic, Row, Col, Spin } from 'antd';
import { BarChartOutlined, CarOutlined, DashboardOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Analysis = () => {
  const [data, setData] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);

  const STATION_MAP = {
    101: '南京江北站',
    102: '苏州阳澄湖站',
    103: '无锡惠山站',
    104: '北京大兴机场站',
    105: '上海浦东川沙站',
    106: '广州花都站',
    107: '深圳南山站',
    108: '重庆绕城北站',
    109: '成都绕城东站',
    110: '济南东站',
    111: '郑州航空港站',
    112: '武汉北三环站',
    113: '西安绕城南站',
    114: '合肥肥东站',
    115: '福州南通道站',
    116: '杭州临安站',
    117: '乌鲁木齐绕城站',
    118: '拉萨柳梧站',
  };

  const getStationName = (id, nameFromApi) => nameFromApi || STATION_MAP[id] || `站点 ${id}`;

  const fetchData = async (range = timeRange) => {
    setLoading(true);
    try {
      const [statsRes, revenueRes] = await Promise.all([
        axios.get('/api/stats', {
          params: {
            start: range[0].format('YYYY-MM-DD HH:mm:ss'),
            end: range[1].format('YYYY-MM-DD HH:mm:ss')
          }
        }),
        axios.get('/api/revenue/forecast', { params: { windowMinutes: 240 } })
      ]);
      setData(statsRes.data || []);
      setRevenue(revenueRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRangeChange = (dates) => {
    if (dates) {
      setTimeRange(dates);
      fetchData(dates);
    }
  };

  const totalTraffic = data.reduce((acc, cur) => acc + (cur.totalCount || 0), 0);
  const avgTraffic = data.length > 0 ? Math.round(totalTraffic / data.length) : 0;
  const stationTotals = data.reduce((acc, cur) => {
    const name = getStationName(cur.stationId, cur.stationName);
    acc[name] = (acc[name] || 0) + (cur.totalCount || 0);
    return acc;
  }, {});
  const stationPairs = Object.entries(stationTotals).sort((a, b) => b[1] - a[1]);
  const stationNames = stationPairs.map(([k]) => k).slice(0, 10);
  const stationValues = stationPairs.map(([, v]) => v).slice(0, 10);
  const typeTotals = data.reduce((acc, cur) => {
    const byType = cur.byType || {};
    Object.entries(byType).forEach(([k, v]) => {
      acc[k] = (acc[k] || 0) + v;
    });
    return acc;
  }, {});

  const chartOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['通行量'], textStyle: { color: '#94a3b8' } },
    xAxis: {
      type: 'category',
      data: data.map(d => d.windowStart.substring(5, 16)),
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#334155' } }
    },
    series: [{
      name: '通行量',
      type: 'line',
      smooth: true,
      data: data.map(d => d.totalCount),
      itemStyle: { color: '#38bdf8' },
      areaStyle: { opacity: 0.1 }
    }]
  };

  const stationChartOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#334155' } } },
    yAxis: {
      type: 'category',
      data: stationNames.slice(0, 10),
      axisLabel: { color: '#94a3b8' }
    },
    series: [{
      name: '通行量',
      type: 'bar',
      data: stationValues.slice(0, 10),
      itemStyle: { color: '#0ea5e9' }
    }]
  };

  const typeChartOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#334155' } } },
    yAxis: {
      type: 'category',
      data: Object.keys(typeTotals),
      axisLabel: { color: '#94a3b8' }
    },
    series: [{
      name: '车辆类型',
      type: 'bar',
      data: Object.values(typeTotals),
      itemStyle: { color: '#10b981' }
    }]
  };

  const revenueOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['预测收入', '实际收入'], textStyle: { color: '#94a3b8' } },
    xAxis: {
      type: 'category',
      data: revenue.map(r => (r.windowStart || '').substring(5, 16)),
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#334155' } }
    },
    series: [
      {
        name: '预测收入',
        type: 'line',
        data: revenue.map(r => r.forecastRevenue || 0),
        itemStyle: { color: '#818cf8' },
        lineStyle: { type: 'dashed' }
      },
      {
        name: '实际收入',
        type: 'bar',
        data: revenue.map(r => r.revenue || 0),
        itemStyle: { color: '#38bdf8' }
      }
    ]
  };

  const columns = [
    { title: '开始时间', dataIndex: 'windowStart' },
    { title: '结束时间', dataIndex: 'windowEnd' },
    { title: '站点名称', dataIndex: 'stationName', render: (_, row) => getStationName(row.stationId, row.stationName) },
    { title: '通行总量', dataIndex: 'totalCount', sorter: (a, b) => a.totalCount - b.totalCount },
    { title: '去重车牌', dataIndex: 'uniquePlates' },
  ];

  return (
    <div className='panel page-fade-in'>
      <div className='panel-title'>离线分析 - 历史数据统计</div>
      
      <Space style={{ marginBottom: 24 }}>
        <RangePicker 
          showTime 
          value={timeRange} 
          onChange={handleRangeChange}
          style={{ width: 400 }}
        />
      </Space>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic 
              title="周期内总通行量"
              value={totalTraffic} 
              prefix={<CarOutlined />} 
              valueStyle={{ color: '#38bdf8' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic 
              title="平均每窗口通行量"
              value={avgTraffic} 
              prefix={<BarChartOutlined />} 
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic 
              title="统计窗口数"
              value={data.length} 
              prefix={<DashboardOutlined />} 
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ color: '#94a3b8', marginBottom: '10px' }}>通行量趋势</div>
            <ReactECharts option={chartOption} style={{ height: '300px' }} />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ color: '#94a3b8', marginBottom: '10px' }}>站点通行量排行</div>
            <ReactECharts option={stationChartOption} style={{ height: '300px' }} />
          </div>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ color: '#94a3b8', marginBottom: '10px' }}>车辆类型分布</div>
            <ReactECharts option={typeChartOption} style={{ height: '300px' }} />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ color: '#94a3b8', marginBottom: '10px' }}>收入预测 (模拟)</div>
            <ReactECharts option={revenueOption} style={{ height: '300px' }} />
          </div>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey={(r, i) => i} 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Analysis;
