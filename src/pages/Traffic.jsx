import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const Traffic = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState({});

  const fetchData = async (pageParams = pagination, filterParams = filters) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/traffic', {
        params: {
          page: pageParams.current - 1,
          size: pageParams.pageSize,
          ...filterParams
        }
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

  const columns = [
    { title: '时间', dataIndex: 'timestamp', render: t => dayjs(t).format('YYYY-MM-DD HH:mm:ss') },
    { title: '车牌号', dataIndex: 'licensePlate' },
    { title: '站点ID', dataIndex: 'stationId' },
    { title: '速度 (km/h)', dataIndex: 'speed', render: v => v || '-' },
  ];

  return (
    <div className='panel' style={{ height: '100%' }}>
      <div className='panel-title'>离线分析 - 车辆通行明细</div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder='搜索车牌 (如: A12)'
          onSearch={handleSearch}
          enterButton
          style={{ width: 300 }}
        />
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
