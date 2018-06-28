// @flow
import * as React from 'react'
import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Row, Col, Form, Input, Button, Select, Switch } from 'antd';

import './index.css';

import typeof baseInfoType from '../../store/BaseInfo'
import typeof otherType from '../../store/Other'

@inject(allStores => ({
    BaseInfo: allStores.BaseInfo,
    Other: allStores.Other
}))
@observer
class BaseInfo extends Component<{ BaseInfo: baseInfoType, Other: otherType, form: any }> {

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: baseInfoType) => {
      if (!err) {
        this.props.BaseInfo.setBaseInfo({...values});
        this.nextStep();
      }
    });
  };

  lastStep = () => {
    this.props.Other.setCurrentStep(this.props.Other.currentStep - 1);
  };

  nextStep = () => {
    this.props.Other.setCurrentStep(this.props.Other.currentStep + 1);
  };

  render() {
    const baseInfo: baseInfoType = this.props.BaseInfo;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="form-baseinfo-wraper">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="U+建模规范版本号" labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('specVersion', {
              initialValue: baseInfo.specVersion,
              // rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Input placeholder="specVersion" />
            )}
          </Form.Item>
          <Form.Item label="设备编号类型" labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('deviceIdType', {
              initialValue: baseInfo.deviceIdType,
              // rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Select placeholder="deviceIdType">
                <Select.Option value={1}>MAC地址</Select.Option>
                <Select.Option value={2}>IMEI码</Select.Option>
                <Select.Option value={3}>自定义</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="设备类型" labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('deviceType', {
              initialValue: baseInfo.deviceType,
              // rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Input placeholder="deviceType" />
            )}
          </Form.Item>
          <Form.Item label="U+产品编号" labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('uPlusId', {
              initialValue: baseInfo.uPlusId,
              rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Input placeholder="uPlusId" />
            )}
          </Form.Item>
          <Form.Item label="设备型号信息" labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('model.number', {
              initialValue: baseInfo.model.number,
              rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Input addonBefore="型号代码" placeholder="model.number"/>
            )}
          </Form.Item>
          <Form.Item label=" " colon={false} labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('model.name', {
              initialValue: baseInfo.model.name,
            })(
              <Input addonBefore="型号名称" placeholder="model.name"/>
            )}
          </Form.Item>
          <Form.Item label=" " colon={false} labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('model.label', {
              initialValue: baseInfo.model.label,
            })(
              <Input addonBefore="型号标签" placeholder="model.label"/>
            )}
          </Form.Item>
          <Form.Item label=" " colon={false} labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('model.description', {
              initialValue: baseInfo.model.description,
            })(
              <Input addonBefore="型号描述" placeholder="model.description"/>
            )}
          </Form.Item>

          <Form.Item label="设备制造商信息" labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('manufacturer.name', {
              initialValue: baseInfo.manufacturer.name,
            })(
              <Input addonBefore="制造商名称" placeholder="manufacturer.name"/>
            )}
          </Form.Item>
          <Form.Item label=" " colon={false} labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('manufacturer.fullName', {
              initialValue: baseInfo.manufacturer.fullName,
            })(
              <Input addonBefore="制造商全称" placeholder="manufacturer.fullName"/>
            )}
          </Form.Item>
          <Form.Item label=" " colon={false} labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('manufacturer.shortName', {
              initialValue: baseInfo.manufacturer.shortName,
            })(
              <Input addonBefore="制造商简称" placeholder="manufacturer.shortName"/>
            )}
          </Form.Item>
          <Form.Item label=" " colon={false} labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('manufacturer.label', {
              initialValue: baseInfo.manufacturer.label,
            })(
              <Input addonBefore="制造商标签" placeholder="manufacturer.label"/>
            )}
          </Form.Item>
          <Form.Item label=" " colon={false} labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('manufacturer.description', {
              initialValue: baseInfo.manufacturer.description,
            })(
              <Input addonBefore="制造商描述" placeholder="manufacturer.description"/>
            )}
          </Form.Item>
          
          <Form.Item label="设备通讯方式" labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('accessWay', {
              initialValue: baseInfo.accessWay,
              // rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Select placeholder="accessWay">
                <Select.Option value={1}>WiFi</Select.Option>
                <Select.Option value={2}>Bluetooth</Select.Option>
                <Select.Option value={3}>2G/3G/4G</Select.Option>
                <Select.Option value={5}>ZigBee</Select.Option>
              </Select>
            )}
          </Form.Item>

          <Form.Item label="标准模型指令标识" colon labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('standardCode', {
              initialValue: baseInfo.standardCode,
              rules: [{ required: true }],
              valuePropName: 'checked'
            })(
              <Switch />
            )}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
            <Row>
              <Col span={6} push={6}>
                <Button type="primary" onClick={this.lastStep}>上一步</Button>
              </Col>
              <Col span={6} push={6}>
                <Button type="primary" htmlType="submit">下一步</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(BaseInfo);
