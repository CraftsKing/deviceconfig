import React from 'react';
import './index.css';

export default class Header extends React.Component {
  render() {
    return (
      <div className="my-header-wraper">
          <span className="my-header-wraper-span">智能设备属性配置工具</span>
          <span className="my-header-wraper-span-right">Copyright © 2018 Wangyufeng</span>
      </div>
    );
  }
}
