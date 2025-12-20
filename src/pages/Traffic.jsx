import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, DatePicker, InputNumber } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Traffic = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState({});

  const fetchData = async (pageParams = pagination, filterParams = filters) => {
    setLoading(true);
    try {
      const params = {
        page: pageParams.current - 1,
        size: pageParams.pageSize,
        licensePlate: filterParams.licensePlate,
        stationId: filterParams.stationId,
        start: filterParams.start ? filterParams.start.format('YYYY-MM-DD HH:mm:ss') : undefined,
        end: filterParams.end ? filterParams.end.format('YYYY-MM-DD HH:mm:ss') : undefined,
      };
      const res = await axios.get('/api/traffic', {
        params
      });
      setData(res.data.records);
      setPagination({
        ...pageParams,
        total: res.data.total
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchData(newPagination, filters);
  };

  const handleSearch = (value) => {
    const newFilters = { ...filters, licensePlate: value };
    setFilters(newFilters);
    fetchData({ ...pagination, current: 1 }, newFilters);
  };

  const handleStationChange = (value) => {
    const newFilters = { ...filters, stationId: value };
    setFilters(newFilters);
  };

  const handleRangeChange = (dates) => {
    const [start, end] = dates || [];
    const newFilters = { ...filters, start, end };
    setFilters(newFilters);
  };

  const handleApply = () => {
    fetchData({ ...pagination, current: 1 }, filters);
  };

  const handleReset = () => {
    const cleared = {};
    setFilters(cleared);
    fetchData({ ...pagination, current: 1 }, cleared);
  };

  const columns = [
    { title: '时间', dataIndex: 'timestamp', render: t => dayjs(t).format('YYYY-MM-DD HH:mm:ss') },
    { title: '车牌号', dataIndex: 'licensePlate' },
    { title: '站点ID', dataIndex: 'stationId' },
  ];

  return (
    <div style={{ height: '100%' }}>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder='按车牌筛选 (例: 粤A12345)'
          onSearch={handleSearch}
          enterButton
          style={{ width: 300 }}
        />
        <InputNumber
          placeholder='站点ID'
          value={filters.stationId}
          onChange={handleStationChange}
          style={{ width: 120 }}
        />
        <RangePicker
          showTime
          value={filters.start && filters.end ? [filters.start, filters.end] : []}
          onChange={handleRangeChange}
          style={{ width: 360 }}
        />
        <Button type='primary' icon={<SearchOutlined />} onClick={handleApply}>查询</Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
      </Space>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey={(r, i) => i} 
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        size='middle'
      />
    </div>
  );
};

export default Traffic;
