import React, { useState, useEffect } from 'react';
import { Table, Input, Tag, Space } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const Alerts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (plate) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/alerts', {
        params: { plate }
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

  const columns = [
    { title: '告警时间', dataIndex: 'timestamp', render: t => dayjs(t).format('YYYY-MM-DD HH:mm:ss') },
    { title: '车牌号', dataIndex: 'licensePlate' },
    { title: '站点ID', dataIndex: 'stationId' },
    { 
      title: '告警类型', 
      dataIndex: 'alertType', 
      render: t => <Tag color='error'>{t === 'Plate Clone' ? '套牌车' : t}</Tag> 
    },
  ];

  return (
    <div style={{ height: '100%' }}>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search 
          placeholder='按车牌筛选' 
          onSearch={val => fetchData(val)} 
          enterButton 
          style={{ width: 300 }}
        />
      </Space>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey={(r, i) => i} 
        loading={loading}
        pagination={{ pageSize: 15 }}
      />
    </div>
  );
};

export default Alerts;
