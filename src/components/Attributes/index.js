// @flow
import * as React from 'react'
import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { default as CreateForm } from './CreateForm'

import { Row, Col, Table, Button } from 'antd';

import './index.css';

import typeof attributeType from '../../store/Attributes'
import typeof otherType from '../../store/Other'

type State = {
  selectAttributes: Array<attributeType>,
  formVisiable: boolean,
  currentAttribute: attributeType | null
};

type AttributesType = {
  attributes: Array<attributeType>,
  removeAttributesByNameList: any,
  addOrUpdateAttribute: any,
  getAttributes: any,
};

@inject(allStores => ({
    Attributes: allStores.Attributes,
    Other: allStores.Other
}))
@observer
export default class Attributes extends Component<{ Attributes: AttributesType, Other: otherType}, State> {
  state:any = {
    selectAttributes: [],
    formVisiable: false,
    currentAttribute: null
  }

  columns: any = [{
    title: '属性名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '代码数组',
    dataIndex: 'code',
    key: 'code',
    render: (text) => (<pre>{text?`${JSON.stringify(text, null, 2)}`:''}</pre>)
  }, {
    title: '属性描述',
    dataIndex: 'desc',
    key: 'desc'
  }, {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
    render: (text) => (<pre>{text?`${text}`:''}</pre>)
  }, {
    title: '是否可读',
    dataIndex: 'readable',
    key: 'readable',
    render: (text) => (<pre>{`${JSON.stringify(text, null, 2)}`}</pre>)
  }, {
    title: '是否可写',
    dataIndex: 'writable',
    key: 'writable',
    render: (text) => (<pre>{`${JSON.stringify(text, null, 2)}`}</pre>)
  }, {
    title: '取值范围',
    dataIndex: 'valueRange',
    key: 'valueRange',
    render: (text) => (<pre>{`${JSON.stringify(text, null, 2)}`}</pre>)
  }, {
    title: '命令类型',
    dataIndex: 'operationType',
    key: 'operationType',
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
    this.setState({selectAttributes: selectedRows});
  }

  handleUpdate = (item: attributeType) => {
    console.log(item);
    // if (item && item.valueRange && item.valueRange.type === 'DATE' && item.valueRange.dataDate) {
    //   item._dataDate = [item.valueRange.dataDate.beginDate, item.valueRange.dataDate.endDate];
    // }
    this.setState({  formVisiable: true, currentAttribute: item });
  }

  handleAddClick = () => {
    this.setState({formVisiable: true});
  }

  handleDeleteClick = () => {
    const nameArr:Array<string> = this.state.selectAttributes.map((item) => item.name);
    this.props.Attributes.removeAttributesByNameList(nameArr);
    this.setState({selectAttributes: []});
  }

  handleConcel = () => {
    // $FlowFixMe
    const form: any = this.formRef.props.form;
    form.resetFields();
    this.setState({ formVisiable: false, currentAttribute: null });
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
      if (values.code && values.code[0] === '') {
        delete values.code;
      }
      if (values && values._code) {
        delete values._code;
      }
      if (values && values._valueRange) {
        delete values._valueRange;
      }
      if (values && values._dataDate) {
        delete values._dataDate;
      }
      if (values && values.valueRange && values.valueRange.type !== 'DATE') {
        delete values.valueRange.dataDate;
      }
      if (values && values.valueRange && values.valueRange.type !== 'LIST') {
        delete values.valueRange.dataList;
      }
      if (values && values.valueRange && values.valueRange.type === 'TIME') {
        if (values.valueRange.dataTime && (values.valueRange.dataTime.minHour || values.valueRange.dataTime.minHour === '0')) {
          values.valueRange.dataTime.minHour = Number(values.valueRange.dataTime.minHour);
        }
        if (values.valueRange.dataTime && (values.valueRange.dataTime.maxHour || values.valueRange.dataTime.maxHour === '0')) {
          values.valueRange.dataTime.maxHour = Number(values.valueRange.dataTime.maxHour);
        }
        if (values.valueRange.dataTime && (values.valueRange.dataTime.minMinute || values.valueRange.dataTime.minMinute === '0')) {
          values.valueRange.dataTime.minMinute = Number(values.valueRange.dataTime.minMinute);
        }
        if (values.valueRange.dataTime && (values.valueRange.dataTime.maxMinute || values.valueRange.dataTime.maxMinute === '0')) {
          values.valueRange.dataTime.maxMinute = Number(values.valueRange.dataTime.maxMinute);
        }
        if (values.valueRange.dataTime && (values.valueRange.dataTime.minSecond || values.valueRange.dataTime.minSecond === '0')) {
          values.valueRange.dataTime.minSecond = Number(values.valueRange.dataTime.minSecond);
        }
        if (values.valueRange.dataTime && (values.valueRange.dataTime.maxSecond || values.valueRange.dataTime.maxSecond === '0')) {
          values.valueRange.dataTime.maxSecond = Number(values.valueRange.dataTime.maxSecond);
        }
      }
      
      this.props.Attributes.addOrUpdateAttribute(values);
      form.resetFields();
      self.setState({ formVisiable: false, currentAttribute: null });
    });
  }

  render() {
    const attributes: Array<attributeType> = this.props.Attributes.getAttributes() || [];

    return (
      <div className="form-attributes-wraper">
        <Table columns={this.columns} dataSource={attributes} rowSelection={{onChange: this.selectOnChange}} pagination={false} rowKey='name' bordered/>
        <Row type="flex" justify="center" className="form-attributes-bottom-button-row">
          <Col span={4} >
            <Button type="primary" icon="plus" ghost onClick={() => this.handleAddClick()}>添加</Button>
          </Col>
          <Col span={4} >
            {
              this.state.selectAttributes.length>0?<Button type="danger" icon="delete" ghost onClick={() => this.handleDeleteClick()}>删除</Button>:<span></span>
            }
          </Col>
          <Col span={4} offset={2}>
            <Button type="primary" onClick={this.lastStep}>上一步</Button>
          </Col>
          <Col span={4} >
            <Button type="primary" disabled={(!attributes || attributes.length===0)} onClick={this.nextStep}>下一步</Button>
          </Col>
        </Row>
        <CreateForm attribute={this.state.currentAttribute} visible={this.state.formVisiable} wrappedComponentRef={(formRef: any) => this.saveFormRef(formRef)}
         onCancel={() => this.handleConcel()} onConfirm={() => this.handleConfirm()} />
      </div>
    );
  }
}
