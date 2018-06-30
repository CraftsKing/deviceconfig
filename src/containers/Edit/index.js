import * as React from 'react'
import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Form, Modal, Row, Col, Steps, Button, Radio } from 'antd';
import './index.css';

import typeof otherType from '../../store/Other'

type stepItemType = {
  title: string,
  description: string,
  component: any
}

const stepList: Array<stepItemType> = [{
  title: 'metadata',
  description: '元数据信息',
  component: require('../../components/MetaData').default
}, {
  title: 'baseInfo',
  description: '设备基本信息',
  component: require('../../components/BaseInfo').default
}, {
  title: 'attributes',
  description: '设备属性信息',
  component: require('../../components/Attributes').default
}, {
  title: 'alarms',
  description: '设备报警信息',
  component: require('../../components/Alarms').default
}, {
  title: 'groupCommands',
  description: '设备组命令信息',
  component: require('../../components/GroupCommands').default
}, {
  title: 'modifiers',
  description: '设备逻辑修正器',
  component: require('../../components/Modifiers').default
}, {
  title: 'constraints',
  description: '命令补丁器数组',
  component: require('../../components/Constraints').default
}];

@inject(allStores => ({
  MetaData: allStores.MetaData,
  BaseInfo: allStores.BaseInfo,
  Attributes: allStores.Attributes,
  Alarms: allStores.Alarms,
  GroupCommands: allStores.GroupCommands,
  Modifiers: allStores.Modifiers,
  Constraints: allStores.Constraints,
  Other: allStores.Other
}))
@observer
class App extends Component {

  state = {
    savedTypeIdList: [],
    visible: false,
  }

  autoSaveHandle() {
    const { MetaData, BaseInfo, Attributes, Alarms, GroupCommands, Modifiers, Constraints } = this.props;

    if (BaseInfo && BaseInfo.uPlusId) {
      const temp = JSON.stringify({metadata: MetaData, baseInfo: BaseInfo, attributes: Attributes.getAttributes(), alarms: Alarms.getAlarms(), groupCommands: GroupCommands.getGroupCommands(), modifiers: Modifiers.getModifiers(), constraints: Constraints.getConstraints()});
      // 存配置
      window.localStorage.setItem(BaseInfo.uPlusId, temp);
      // 增加已存文件名称
      const savedTypeIdStr = window.localStorage.getItem('__saved_typeid_arr__');
      const savedTypeIdList = savedTypeIdStr?savedTypeIdStr.split(','):[];
      if (savedTypeIdList.indexOf(BaseInfo.uPlusId) === -1) {
        savedTypeIdList.push(BaseInfo.uPlusId);
        window.localStorage.setItem('__saved_typeid_arr__', savedTypeIdList.toString());
      }

      console.log('暂存成功！-----------------------------');
      this.setState({
        savedTypeIdList: savedTypeIdList
      });
    }
  }

  reStore(typeId) {
    const self = this;
    const storage = window.localStorage.getItem(typeId);
    try {
      const configObj = JSON.parse(storage);
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
    } catch (error) {
      console.log(error);
    }
  }
  
  componentDidMount() {
    this.timerID = setInterval(
      () => this.autoSaveHandle(),
      30000
    );

    const savedTypeIdStr = window.localStorage.getItem('__saved_typeid_arr__');
    const savedTypeIdList = savedTypeIdStr?savedTypeIdStr.split(','):[];
    if (savedTypeIdList && savedTypeIdList.length > 0) {
      this.setState({
        savedTypeIdList: savedTypeIdList
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  openModal() {
    this.setState({
      visible: true
    });
  }

  handleOk() {
    const form: any = this.props.form;
    const self: any = this;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      self.reStore(values.typeId);
      form.resetFields();
      self.setState({ visible: false });
    });
  }

  handleCancel() {
    const form: any = this.props.form;
    form.resetFields();
    this.setState({ visible: false });
  }

  render() {

    const currentStep: $PropertyType<otherType, 'currentStep'> = this.props.Other.currentStep;
    const currentStepItem: stepItemType = stepList[currentStep];
    const { getFieldDecorator } = this.props.form

    return (
      <div className="edit-wraper">
        <Row>
          <Col span={4}>
            <div className="edit-left-step">
              <Steps direction="vertical" current={currentStep}>
                {
                  stepList.map((item, index) => (
                    <Steps.Step key={index} title={item.title} description={item.description} />
                  ))
                }
              </Steps>
              <Row justify="" >
                <Col span={24} style={{textAlign: 'center'}}>
                  {
                    this.state.savedTypeIdList && this.state.savedTypeIdList.length > 0
                    ? (
                        <Button type="primary" icon="sync" ghost onClick={() => this.openModal()}>恢复暂存版本</Button>
                      )
                    : null
                  }
                </Col>
              </Row>
              <Modal
                title="请选择需要恢复的文件"
                visible={this.state.visible}
                onOk={() => this.handleOk()}
                onCancel={() => this.handleCancel()}
                width="800px"
              >
                <Form>
                  <Form.Item>
                    {getFieldDecorator('typeId', {})(
                      <Radio.Group>
                        {
                          this.state.savedTypeIdList.map((item) => (<Radio value={item} key={item}>{item}</Radio>))
                        }
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </Col>
          <Col span={20}>
            <div className="edit-right-step-content">
              <currentStepItem.component history={this.props.history}/>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(App)
