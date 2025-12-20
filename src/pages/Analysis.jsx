import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Space, Card, Statistic, Row, Col, Spin } from 'antd';
import { BarChartOutlined, CarOutlined, DashboardOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Analysis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);

  const STATION_MAP = {
    101: '邳州东站',
    102: '丰县北站',
    103: '铜山站',
    104: '睢宁站',
    105: '沛县站',
  };

  const getStationName = (id) => STATION_MAP[id] || `站点 ${id}`;

  const fetchData = async (range = timeRange) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/stats', {
        params: {
          start: range[0].format('YYYY-MM-DD HH:mm:ss'),
          end: range[1].format('YYYY-MM-DD HH:mm:ss')
        }
      });
      setData(res.data);
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

  const totalTraffic = data.reduce((acc, cur) => acc + (cur.totalCnt || 0), 0);
  const avgTraffic = data.length > 0 ? Math.round(totalTraffic / data.length) : 0;

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
      data: data.map(d => d.totalCnt),
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
      data: [...new Set(data.map(d => getStationName(d.stationId)))].slice(0, 10),
      axisLabel: { color: '#94a3b8' }
    },
    series: [{
      name: '通行量',
      type: 'bar',
      data: [...new Set(data.map(d => d.totalCnt))].slice(0, 10),
      itemStyle: { color: '#0ea5e9' }
    }]
  };

  const columns = [
    { title: '开始时间', dataIndex: 'windowStart' },
    { title: '结束时间', dataIndex: 'windowEnd' },
    { title: '站点名称', dataIndex: 'stationId', render: id => getStationName(id) },
    { title: '通行总量', dataIndex: 'totalCnt', sorter: (a, b) => a.totalCnt - b.totalCnt },
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
