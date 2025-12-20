import React, { useState } from 'react';
import { Tabs } from 'antd';
import Traffic from './Traffic';
import Alerts from './Alerts';
import { SearchOutlined, AlertOutlined } from '@ant-design/icons';

const Query = () => {
  return (
    <div className='panel page-fade-in' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className='panel-title'>交互式查询 - 车辆通行与告警检索</div>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: (
              <span>
                <SearchOutlined />
                通行记录查询
              </span>
            ),
            children: <Traffic />,
          },
          {
            key: '2',
            label: (
              <span>
                <AlertOutlined />
                告警记录查询
              </span>
            ),
            children: <Alerts />,
          },
        ]}
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default Query;
