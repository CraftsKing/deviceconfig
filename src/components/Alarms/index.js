// @flow
import * as React from 'react'
import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { default as CreateForm } from './CreateForm'

import { Row, Col, Table, Button } from 'antd';

import './index.css';

import typeof alarmType from '../../store/Alarms'
import typeof otherType from '../../store/Other'

type State = {
  selectAlarms: Array<alarmType>,
  formVisiable: boolean,
  currentAlarm: alarmType | null
};

type AlarmsType = {
  alarms: Array<alarmType>,
  removeAlarmsByNameList: any,
  addOrUpdateAlarm: any,
  getAlarms: any,
};

@inject(allStores => ({
    Alarms: allStores.Alarms,
    Other: allStores.Other
}))
@observer
export default class Alarms extends Component<{ Alarms: AlarmsType, Other: otherType}, State> {
  state: any = {
    selectAlarms: [],
    formVisiable: false,
    currentAlarm: null
  }

  columns: any = [{
    title: '报警名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '指令代码',
    dataIndex: 'code',
    key: 'code',
    render: (text) => (<pre>{text?`${text}`:''}</pre>)
  }, {
    title: '详细报警信息描述',
    dataIndex: 'desc',
    key: 'desc'
  }, {
    title: '清除标志',
    dataIndex: 'clear',
    key: 'clear',
    render: (text) => (<pre>{text?`${text}`:''}</pre>)
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a onClick={() => this.handleUpdate(record)}>修改</a>
      </span>
    ),
  }]
  
  lastStep = () => {
    this.props.Other.setCurrentStep(this.props.Other.currentStep - 1);
  }

  nextStep = () => {
    this.props.Other.setCurrentStep(this.props.Other.currentStep + 1);
  }

  selectOnChange = (selectedRowKeys: any, selectedRows: any) => {
    this.setState({selectAlarms: selectedRows});
  }

  handleUpdate = (item: alarmType) => {
    console.log(item);
    this.setState({ formVisiable: true, currentAlarm: item });
  }

  handleAddClick = () => {
    this.setState({formVisiable: true});
  }

  handleDeleteClick = () => {
    const nameArr:Array<string> = this.state.selectAlarms.map((item) => item.name);
    this.props.Alarms.removeAlarmsByNameList(nameArr);
    this.setState({selectAlarms: []});
  }

  handleConcel = () => {
    // $FlowFixMe
    const form: any = this.formRef.props.form;
    form.resetFields();
    this.setState({ formVisiable: false, currentAlarm: null });
  }

  saveFormRef = (formRef: any) => {
    // $FlowFixMe
    this.formRef = formRef;
  }

  handleConfirm = () => {
    // $FlowFixMe
    const form: any = this.formRef.props.form;
    const self: any = this;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      this.props.Alarms.addOrUpdateAlarm(values);
      form.resetFields();
      self.setState({ formVisiable: false, currentAlarms: null });
    });
  }

  render() {
    const alarms: Array<alarmType> = this.props.Alarms.getAlarms() || [];

    return (
      <div className="form-attributes-wraper">
        <Table columns={this.columns} dataSource={alarms} rowSelection={{onChange: this.selectOnChange}} pagination={false} rowKey='name' bordered/>
        <Row type="flex" justify="center" className="form-attributes-bottom-button-row">
          <Col span={4} >
            <Button type="primary" icon="plus" ghost onClick={() => this.handleAddClick()}>添加</Button>
          </Col>
          <Col span={4} >
            {
              this.state.selectAlarms.length>0?<Button type="danger" icon="delete" ghost onClick={() => this.handleDeleteClick()}>删除</Button>:<span></span>
            }
          </Col>
          <Col span={4} offset={2}>
            <Button type="primary" onClick={this.lastStep}>上一步</Button>
          </Col>
          <Col span={4} >
            <Button type="primary" onClick={this.nextStep}>下一步</Button>
          </Col>
        </Row>
        <CreateForm alarm={this.state.currentAlarm} visible={this.state.formVisiable} wrappedComponentRef={(formRef: any) => this.saveFormRef(formRef)}
         onCancel={() => this.handleConcel()} onConfirm={() => this.handleConfirm()} />
      </div>
    );
  }
}
