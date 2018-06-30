import * as React from 'react'
import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Upload, Button, Icon } from 'antd';
import './index.css';

@inject(allStores => ({
    MetaData: allStores.MetaData,
    BaseInfo: allStores.BaseInfo,
    Attributes: allStores.Attributes,
    Alarms: allStores.Alarms,
    GroupCommands: allStores.GroupCommands,
    Modifiers: allStores.Modifiers,
    Constraints: allStores.Constraints,
}))
@observer
class App extends Component {
  state = {
    savedTypeIdList: [],
  }

  handleNewClick = () => {
    this.props.history.push('/edit');
  };

  handleChange = (info, fileList, e) => {
    const self = this;
    const file = info.file;
    if (file && file.originFileObj) {
      try {
        const reader = new FileReader();
        reader.onload = function() {
          let tempStr = this.result + '';
          // 如果不是以‘{’开始，则去掉
          if (!tempStr.startsWith('{')) {
            tempStr = tempStr.slice(tempStr.indexOf('{'), tempStr.length);
          }
          // 如果不是以‘}’结束，则去掉
          if (!tempStr.endsWith('{')) {
            tempStr = tempStr.slice(0, tempStr.lastIndexOf('}')+1);
          }
          self.execAddOrUpdate(JSON.parse(tempStr));
          return true;
        };
        reader.readAsText(file.originFileObj);
      } catch (error) {
        console.log(error);
      }
    }
    return false;
  }

  execAddOrUpdate = (configObj) => {
    const self = this;
    if (window.__timeout) {
      window.clearTimeout(window.__timeout);
    }
    window.__timeout = window.setTimeout(() => {
      if (configObj && configObj.metadata) {
        self.props.MetaData.setMetaData(configObj.metadata);
      }
      if (configObj && configObj.baseInfo) {
        self.props.BaseInfo.setBaseInfo(configObj.baseInfo);
      }

      if (configObj && configObj.attributes) {
        self.props.Attributes.removeAll();
        for (let i = 0; i < configObj.attributes.length; i++) {
          const item = configObj.attributes[i];
          self.props.Attributes.addOrUpdateAttribute(item);
        }
      }
      if (configObj && configObj.alarms) {
        self.props.Alarms.removeAll();
        for (let i = 0; i < configObj.alarms.length; i++) {
          const item = configObj.alarms[i];
          self.props.Alarms.addOrUpdateAlarm(item);
        }
      }
      if (configObj && configObj.groupCommands) {
        self.props.GroupCommands.removeAll();
        for (let i = 0; i < configObj.groupCommands.length; i++) {
          const item = configObj.groupCommands[i];
          self.props.GroupCommands.addOrUpdateGroupCommand(item);
        }
      }
      if (configObj && configObj.modifiers) {
        self.props.Modifiers.removeAll();
        for (let i = 0; i < configObj.modifiers.length; i++) {
          const item = configObj.modifiers[i];
          self.props.Modifiers.addOrUpdateModifier(item);
        }
      }
      if (configObj && configObj.constraints) {
        self.props.Constraints.removeAll();
        for (let i = 0; i < configObj.constraints.length; i++) {
          const item = configObj.constraints[i];
          self.props.Constraints.addOrUpdateConstraint(item);
        }
      }
      self.props.history.push('/edit');
    }, 100);
  }

  fileNameOnClick = (fileName) => {
    const storage = window.localStorage.getItem(fileName);
    try {
      const configObj = JSON.parse(storage);
      this.execAddOrUpdate(configObj);
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    const savedTypeIdStr = window.localStorage.getItem('__saved_typeid_arr__');
    const savedTypeIdList = savedTypeIdStr?savedTypeIdStr.split(','):[];
    if (savedTypeIdList && savedTypeIdList.length > 0) {
      this.setState({
        savedTypeIdList: savedTypeIdList
      });
    }
  }

  render() {

    const uploadProps = {
      accept: '.json',
      showUploadList: { showPreviewIcon: true, showRemoveIcon: false },
      // action: '//jsonplaceholder.typicode.com/posts/',
      onChange: this.handleChange,
      multiple: false
    };

    return (
      <div className="home-wraper">
        <div className="home-button-wraper">
          <Button className="home-button-new" type="primary" icon="file-add" onClick={() => this.handleNewClick()}>新建</Button>

          <Upload {...uploadProps}>
            <Button>
              <Icon type="upload" />导入
            </Button>
          </Upload>
        </div>
        <div className="home-recent-file-wraper">
          <div className="home-recent-file-title">最近文件</div>
          {
            this.state.savedTypeIdList.map((item, index) => (
              <div key={item} className="home-recent-file-lists">
                <div className="ant-upload-list-item ant-upload-list-item-done">
                  <div className="ant-upload-list-item-info">
                    <span>
                      <i className="anticon anticon-paper-clip"></i>
                      <span className="ant-upload-list-item-name" onClick={() => this.fileNameOnClick(item)}>{`${item}.json`}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          }
          
        </div>
      </div>
    );
  }
}

export default App;
