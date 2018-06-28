import * as React from 'react'
import { Component } from 'react';
// import { inject, observer } from 'mobx-react';

import { Upload, Button, Icon } from 'antd';
import './index.css';

// import typeof metadataType from '../../store/MetaData'
// import typeof baseInfoType from '../../store/BaseInfo'

// const Search = Input.Search;

// @inject(allStores => ({
//     MetaData: allStores.MetaData,
//     BaseInfo: allStores.BaseInfo
// }))
// @observer
class App extends Component {

  handleNewClick = () => {
    this.props.history.push('/edit');
  };

  handleChange = (info) => {
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    // 3. filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });
    console.log(fileList);
  };

  render() {

    const uploadProps = {
      accept: '.json',
      showUploadList: { showPreviewIcon: true, showRemoveIcon: false },
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange: this.handleChange,
      multiple: false
    };
    const recentFilesList = [1];

    return (
      <div className="home-wraper">
        <div className="home-button-wraper">
          <Button className="home-button-new" type="primary" icon="file-add" onClick={() => this.handleNewClick()}>新建</Button>

          <Upload {...uploadProps}>
            <Button>
              <Icon type="upload" disabled/>导入
            </Button>
          </Upload>
        </div>
        <div className="home-recent-file-wraper">
          <div className="home-recent-file-title">最近文件</div>
          {
            recentFilesList.map((item, index) => (
              <div key={index} className="home-recent-file-lists">
                <div className="ant-upload-list-item ant-upload-list-item-done">
                  <div className="ant-upload-list-item-info">
                    <span>
                      <i className="anticon anticon-paper-clip"></i>
                      <span className="ant-upload-list-item-name" title="xxx.png">xxx.json</span>
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
