import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, DatePicker, InputNumber, Select } from 'antd';
import { SearchOutlined, ReloadOutlined, CompassOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Traffic = () => {
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
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
      const res = await axios.get('/api/traffic', { params });
      const records = res.data.records || [];
      setRawData(records);
      setData(records);
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
    // Re-run backend filters (时间/车牌/站点) then apply前端筛选
    fetchData({ ...pagination, current: 1 }, filters);
  };

  const handleReset = () => {
    const cleared = {};
    setFilters(cleared);
    fetchData({ ...pagination, current: 1 }, cleared);
  };

  const VEHICLE_TYPE_MAP = {
    '01': '大型汽车',
    '02': '小型汽车',
    '03': '使馆汽车',
    '04': '领馆汽车',
    '05': '境外汽车',
    '06': '外籍汽车',
    '07': '普通摩托车',
    '08': '轻便摩托车',
    '16': '教练汽车',
    '20': '公交客车',
    '21': '出租客运',
    '22': '旅游客车',
    '23': '警用车辆',
    '24': '消防车辆',
    '25': '救护车辆',
    '26': '工程救险',
    '31': '武警车辆',
    '32': '军队车辆',
    '51': '大功率摩托',
    '52': '新能源小型',
    '53': '新能源大型',
    '54': '新能源货车',
    '1': '小型汽车',
    '2': '大型汽车'
  };

  const formatVehicleType = (val) => {
    if (!val) return '未知车型';
    const normalized = String(val).trim();
    return VEHICLE_TYPE_MAP[normalized] || normalized;
  };

  const humanDirection = (d) => {
    if (d === null || d === undefined) return '未知';
    const norm = String(d).trim().toUpperCase();
    if (norm === '1' || norm === 'IN' || norm.includes('入')) return '进站';
    if (norm === '2' || norm === 'OUT' || norm.includes('出')) return '出站';
    return d;
  };

  const applyLocalFilters = (records, filterParams) => {
    return (records || []).filter((r) => {
      if (filterParams.vehicleType && formatVehicleType(r.vehicleTypeCode || r.vehicleType) !== filterParams.vehicleType) {
        return false;
      }
      if (filterParams.direction && humanDirection(r.direction) !== filterParams.direction) {
        return false;
      }
      if (filterParams.stationName && !(r.kkmc || '').includes(filterParams.stationName)) {
        return false;
      }
      if (filterParams.vehicleModel && !(r.vehicleModel || '').includes(filterParams.vehicleModel)) {
        return false;
      }
      return true;
    });
  };

  const columns = [
    { title: '过车时间', dataIndex: 'timestamp', render: t => dayjs(t).format('YYYY-MM-DD HH:mm:ss'), align: 'center' },
    { title: '车牌号', dataIndex: 'licensePlate', render: (text) => <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{text}</span>, align: 'center' },
    { title: '方向', dataIndex: 'direction', render: (d) => humanDirection(d), align: 'center' },
    { title: '行政区划', dataIndex: 'xzqhmc', align: 'center' },
    { title: '站点ID', dataIndex: 'stationId', align: 'center' },
    { title: '站点名称', dataIndex: 'kkmc', ellipsis: true, align: 'center' },
  ];

  return (
    <div style={{ height: '100%' }}>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          className='search-accent'
          allowClear
          placeholder='按车牌筛选 (例: 粤A12345)'
          onSearch={handleSearch}
          enterButton
          style={{ width: 300 }}
        />
        <Input
          className='search-accent'
          placeholder='站点名称'
          value={filters.stationName}
          onChange={(e) => setFilters({ ...filters, stationName: e.target.value })}
          allowClear
          style={{ width: 160 }}
          prefix={<EnvironmentOutlined style={{ color: '#94a3b8' }} />}
        />
        <InputNumber
          className='search-accent'
          placeholder='站点ID'
          value={filters.stationId}
          onChange={handleStationChange}
          style={{ width: 120 }}
        />
        <Input
          className='search-accent'
          placeholder='车型 / 品牌'
          value={filters.vehicleModel}
          onChange={(e) => setFilters({ ...filters, vehicleModel: e.target.value })}
          allowClear
          style={{ width: 140 }}
          prefix={<CompassOutlined style={{ color: '#94a3b8' }} />}
        />
        <Select
          className='search-accent'
          popupClassName="dark-dropdown"
          placeholder='车辆类型'
          allowClear
          value={filters.vehicleType}
          onChange={(val) => setFilters({ ...filters, vehicleType: val })}
          style={{ width: 150 }}
          options={Object.values(VEHICLE_TYPE_MAP).map(v => ({ label: v, value: v }))}
        />
        <Select
          className='search-accent'
          popupClassName="dark-dropdown"
          placeholder='方向'
          allowClear
          value={filters.direction}
          onChange={(val) => setFilters({ ...filters, direction: val })}
          style={{ width: 120 }}
          options={[
            { label: '进站', value: '进站' },
            { label: '出站', value: '出站' },
          ]}
        />
        <RangePicker
          showTime
          value={filters.start && filters.end ? [filters.start, filters.end] : []}
          onChange={handleRangeChange}
          style={{ width: 360 }}
        />
        <Button type='primary' icon={<SearchOutlined />} onClick={handleApply}>查询</Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset} className="search-accent" style={{ backgroundColor: 'transparent', color: '#fff', borderColor: '#334155' }}>重置</Button>
      </Space>
      <Table 
        columns={columns} 
        dataSource={applyLocalFilters(data, filters)} 
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
