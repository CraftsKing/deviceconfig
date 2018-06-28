// @flow
import * as React from 'react'
import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { default as CreateForm } from './CreateForm'

import { Row, Col, Table, Button } from 'antd';

import './index.css';

import typeof groupCommandType from '../../store/GroupCommands'
import typeof otherType from '../../store/Other'

type State = {
  selectGroupCommands: Array<groupCommandType>,
  formVisiable: boolean,
  currentGroupCommand: groupCommandType | null
};

type GroupCommandsType = {
  groupCommands: Array<groupCommandType>,
  removeGroupCommandsByNameList: any,
  addOrUpdateGroupCommand: any,
  getGroupCommands: any,
};

type AttributesType = {
  getAttributes: any,
};

@inject(allStores => ({
    GroupCommands: allStores.GroupCommands,
    Attributes: allStores.Attributes,
    Other: allStores.Other
}))
@observer
export default class GroupCommands extends Component<{Attributes: AttributesType, GroupCommands: GroupCommandsType, Other: otherType}, State> {
  state: any = {
    selectGroupCommands: [],
    formVisiable: false,
    currentGroupCommand: null
  }

  columns: any = [{
    title: '组命令名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '指令代码',
    dataIndex: 'code',
    key: 'code',
    render: (text) => (<pre>{text?`${text}`:''}</pre>)
  }, {
    title: '组命令描述',
    dataIndex: 'desc',
    key: 'desc'
  }, {
    title: '属性名数组',
    dataIndex: 'attrNameList',
    key: 'attrNameList',
    render: (text) => (<pre>{`${JSON.stringify(text, null, '\t')}`}</pre>)
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
    this.setState({selectGroupCommands: selectedRows});
  }

  handleUpdate = (item: groupCommandType) => {
    console.log(item);
    this.setState({ formVisiable: true, currentGroupCommand: item });
  }

  handleAddClick = () => {
    this.setState({formVisiable: true});
  }

  handleDeleteClick = () => {
    const nameArr:Array<string> = this.state.selectGroupCommands.map((item) => item.name);
    this.props.GroupCommands.removeGroupCommandsByNameList(nameArr);
    this.setState({selectGroupCommands: []});
  }

  handleConcel = () => {
    // $FlowFixMe
    const form: any = this.formRef.props.form;
    form.resetFields();
    this.setState({ formVisiable: false, currentGroupCommand: null });
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
      if (values && values._attrNameList) {
        delete values._attrNameList;
      }
      this.props.GroupCommands.addOrUpdateGroupCommand(values);
      form.resetFields();
      self.setState({ formVisiable: false, currentAlarms: null });
    });
  }

  render() {
    const groupCommands: Array<groupCommandType> = this.props.GroupCommands.getGroupCommands() || [];

    return (
      <div className="form-attributes-wraper">
        <Table columns={this.columns} dataSource={groupCommands} rowSelection={{onChange: this.selectOnChange}} pagination={false} rowKey='name' bordered/>
        <Row type="flex" justify="center" className="form-attributes-bottom-button-row">
          <Col span={4} >
            <Button type="primary" icon="plus" ghost onClick={() => this.handleAddClick()}>添加</Button>
          </Col>
          <Col span={4} >
            {
              this.state.selectGroupCommands.length>0?<Button type="danger" icon="delete" ghost onClick={() => this.handleDeleteClick()}>删除</Button>:<span></span>
            }
          </Col>
          <Col span={4} offset={2}>
            <Button type="primary" onClick={this.lastStep}>上一步</Button>
          </Col>
          <Col span={4} >
            <Button type="primary" onClick={this.nextStep}>下一步</Button>
          </Col>
        </Row>
        <CreateForm attributes={this.props.Attributes.getAttributes()} groupCommand={this.state.currentGroupCommand} visible={this.state.formVisiable} wrappedComponentRef={(formRef: any) => this.saveFormRef(formRef)}
         onCancel={() => this.handleConcel()} onConfirm={() => this.handleConfirm()} />
      </div>
    );
  }
}
