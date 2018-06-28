// @flow
import * as React from 'react'
import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Row, Col, Form, Input, Button } from 'antd';

import './index.css';

import typeof metadataType from '../../store/MetaData'
import typeof otherType from '../../store/Other'

@inject(allStores => ({
    MetaData: allStores.MetaData,
    Other: allStores.Other
}))
@observer
class MetaData extends Component<{ MetaData: metadataType, Other: otherType, form: any }> {

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: metadataType) => {
      if (!err) {
        this.props.MetaData.setMetaData({...values})
        this.nextStep();
      }
    });
  };

  nextStep = () => {
  	this.props.Other.setCurrentStep(this.props.Other.currentStep + 1);
  };

  render() {
    const metaData: metadataType = this.props.MetaData;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="form-metadata-wraper">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="解析器最小版本" colon labelCol={{span: 5}} wrapperCol={{span: 10}}>
            {getFieldDecorator('minParserVersion', {
              initialValue: metaData.minParserVersion,
              rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Input placeholder="minParserVersion" />
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
            <Row>
              <Col span={8} push={8}>
                <Button type="primary" htmlType="submit">下一步</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(MetaData);
