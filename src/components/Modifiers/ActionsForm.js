import * as React from 'react'
import { Component } from 'react'

import { Modal, Form, Row, Col, Input, Radio, Checkbox, Switch, Select, Icon } from 'antd'

import typeof modifierType from '../../store/Modifiers'

const formItemLayout: any = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  },
}

const getCurrentAction = (modifier, name) => {
  let action = {
    name: '',
    rewriteFields: [],
    defaultValue: '',
    writable: false,
    valueRange: null
  };
  if (modifier && modifier.actions && name) {
    const actionArr = modifier.actions.filter((item) => item.name === name);
    if (actionArr && actionArr.length > 0) {
      action.name = actionArr[0].name;
      action.rewriteFields = actionArr[0].rewriteFields.split('');
      action.defaultValue = actionArr[0].defaultValue;
      action.writable = actionArr[0].writable;
      action.valueRange = actionArr[0].valueRange;
    }
  }
  return action;
}

class ActionsForm extends Component<{attributes: any, modifier: modifierType | null, form: any, visible: boolean, onCancel: any, onConfirm: any}> {

  addDataList = () => {
    const { form } = this.props;
    const valueRange = form.getFieldValue('_valueRange');
    const dataList = valueRange.dataList || [];
    for (let i = 0; i < dataList.length; i++) {
      const item = dataList[i];
      if (!item.data) {
        return;
      }
    }
    dataList.push({data: '',code: '', desc: ''});
    // important! notify form to detect changes
    form.setFieldsValue({
      '_dataList': dataList
    });
  }
  removeDataList = (index: number) => {
    const { form } = this.props;
    const valueRange = form.getFieldValue('_valueRange');
    const dataList = valueRange.dataList || [];
    if (dataList.length === 1) {
      return;
    }
    dataList.splice(index, 1);
    // can use data-binding to set
    form.setFieldsValue({
      '_dataList': dataList,
    });
  }
  nameOnChange = (value) => {
    const { form } = this.props;
    // important! notify form to detect changes
    form.setFieldsValue({
      '_currentActionName': value
    });
  }

  render() {
    const { modifier, visible, onCancel, onConfirm, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const attributes = this.props.attributes || []

    getFieldDecorator('id', { initialValue: (modifier&&modifier.id)?modifier.id:null });
    getFieldDecorator('actions', { initialValue: (modifier&&modifier.actions)?modifier.actions.slice():null });
    getFieldDecorator('_currentActionName', { initialValue: (modifier&&modifier.actions&&modifier.actions.slice()[0])?modifier.actions.slice()[0].name:'请选择' });
    getFieldDecorator('_dataList', { initialValue: null });

    let valueRangeDataList: any = [];
    let valueRangeDataStep: any = {};
    let attributeAction = null;
    if (!modifier) {
      // 新增时从attribute得到dataList
      const attList = attributes.filter((item) => item.name === getFieldValue('_currentActionName'));
      if (attList && attList.length > 0 && attList[0]) {
        attributeAction = attList[0];
      }
    } else {
      // 更新时从modifier取
      attributeAction = getCurrentAction(modifier, getFieldValue('_currentActionName'));
      const attList = attributes.filter((item) => item.name === getFieldValue('_currentActionName'));
      if (attList && attList.length > 0 && attList[0]) {
        attributeAction.valueRange = {...attributeAction.valueRange, type: attList[0].valueRange.type }
      }
    }
    // if (getFieldValue(`_actions[${getFieldValue('_currentActionName')}].rewriteFields`)
      // && getFieldValue(`_actions[${getFieldValue('_currentActionName')}].rewriteFields`).indexOf('V') !== -1) {
      getFieldDecorator(`_actions[${getFieldValue('_currentActionName')}]._valueRange.type`, {
        initialValue: (attributeAction&&attributeAction.valueRange&&attributeAction.valueRange.type)?attributeAction.valueRange.type:""
      });
    // } else {
    //   getFieldDecorator(`_actions[${getFieldValue('_currentActionName')}]._valueRange.type`, {
    //     initialValue: ''
    //   });
    // }
    if (attributeAction && attributeAction.valueRange) {
      if (attributeAction.valueRange.dataList && !getFieldValue('_dataList')) {
        valueRangeDataList = attributeAction.valueRange.dataList.slice();
      }
      if (attributeAction.valueRange.dataStep) {
        valueRangeDataStep = attributeAction.valueRange.dataStep;
      }
    }
    if (getFieldValue('_dataList')) {
      valueRangeDataList = getFieldValue('_dataList');
    }
    // valueRangeDataList.push(getFieldValue('_dataList'));
    if (valueRangeDataList.length === 0) {
      valueRangeDataList.push({data: '',code: '', desc: ''});
    }

    return (
      <Modal
        visible={visible}
        title={modifier?'修改':'添加'}
        okText="确定"
        onCancel={onCancel}
        onOk={onConfirm}
      >
        <Form>
          {
            modifier
            ? (
                <Form.Item label="已有的action" {...formItemLayout}>
                  {getFieldDecorator('_currentActionName_abandon', {
                    initialValue: (modifier&&modifier.actions&&modifier.actions[0])?modifier.actions[0].name:'',
                  })(
                    <Radio.Group size="small" onChange={(e) => this.nameOnChange(e.target.value)}>
                      {
                        (modifier&&modifier.actions)
                        ? modifier.actions.slice().map((action) => (
                            <Radio.Button key={action.name} value={action.name}>{action.name}</Radio.Button>
                          ))
                        : null
                      }
                    </Radio.Group>
                  )}
                </Form.Item>
              )
            : null
          }
          {
            modifier
            ? (
                <Form.Item label="action名称" {...formItemLayout}>
                  {getFieldDecorator(`_actions[${getFieldValue('_currentActionName')}].name`, {
                    initialValue: getFieldValue('_currentActionName')||'_test_',
                    rules: [{ required: true, message: '不允许为空!' }],
                  })(
                    <Input disabled/>
                  )}
                </Form.Item>
              )
            : (
                <Form.Item label="action名称" {...formItemLayout}>
                  {getFieldDecorator(`_actions[${getFieldValue('_currentActionName')}].name`, {
                    initialValue: (getFieldValue('_currentActionName'))?(getFieldValue('_currentActionName')):'请选择',
                    rules: [{ required: true, message: '不允许为空!' }],
                  })(
                    <Select onSelect={(value) => this.nameOnChange(value)}>
                      {
                        attributes.filter((item) => item.valueRange.type==='LIST' || item.valueRange.type==='STEP').map((attribute) => (
                          <Select.Option key={attribute.name} value={attribute.name}>{attribute.name}</Select.Option>
                        ))
                      }
                    </Select>
                  )}
                </Form.Item>
              )
          }
          {
            getFieldValue(`_actions[${getFieldValue('_currentActionName')}].name`) !== '请选择'
            ? (
                <Form.Item label="rewriteFields" {...formItemLayout}>
                  {getFieldDecorator(`_actions[${getFieldValue('_currentActionName')}].rewriteFields`, {
                    initialValue: getCurrentAction(modifier, getFieldValue('_currentActionName')).rewriteFields || [],
                    rules: [{ required: true, message: '不允许为空!' }],
                  })(
                    <Checkbox.Group options={[{label: 'D', value: 'D'}, {label: 'V', value: 'V'}, {label: 'W', value: 'W'}]} />
                  )}
                </Form.Item>
              )
            : null
          }
          {
            getFieldValue(`_actions[${getFieldValue('_currentActionName')}].rewriteFields`)&&getFieldValue(`_actions[${getFieldValue('_currentActionName')}].rewriteFields`).indexOf('D') !== -1
            ? (
                <Form.Item label="defaultValue" {...formItemLayout}>
                  {getFieldDecorator(`_actions[${getFieldValue('_currentActionName')}].defaultValue`, {
                    initialValue: getCurrentAction(modifier, getFieldValue('_currentActionName')).defaultValue,
                  })(
                    <Input />
                  )}
                </Form.Item>
              )
            : null
          }
          {
            getFieldValue(`_actions[${getFieldValue('_currentActionName')}].rewriteFields`)&&getFieldValue(`_actions[${getFieldValue('_currentActionName')}].rewriteFields`).indexOf('W') !== -1
            ? (
                <Form.Item label="writable" {...formItemLayout}>
                  {getFieldDecorator(`_actions[${getFieldValue('_currentActionName')}].writable`, {
                    initialValue: !!getCurrentAction(modifier, getFieldValue('_currentActionName')).writable,
                    // rules: [{ required: true }],
                    valuePropName: 'checked'
                  })(
                    <Switch />
                  )}
                </Form.Item>
              )
            : null
          }
          {
            getFieldValue(`_actions[${getFieldValue('_currentActionName')}].rewriteFields`)&&getFieldValue(`_actions[${getFieldValue('_currentActionName')}].rewriteFields`).indexOf('V') !== -1&&getFieldValue(`_actions[${getFieldValue('_currentActionName')}]._valueRange.type`) === 'LIST'
            ? (
                valueRangeDataList.map((item, ind) => (
                  <Row type="flex" justify="center" key={item.data}>
                    <Col span={7} >
                      <Form.Item>
                        {getFieldDecorator(`_valueRange.dataList[${ind}.data]`, {
                          initialValue: item.data,
                          rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                        })(
                          <Input addonBefore="data"/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={7} >
                      <Form.Item>
                        {getFieldDecorator(`_valueRange.dataList[${ind}].code`, {
                          initialValue: item.code,
                        })(
                          <Input addonBefore="code"/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={7} >
                      <Form.Item>
                        {getFieldDecorator(`_valueRange.dataList[${ind}].desc`, {
                          initialValue: item.desc,
                        })(
                          <Input addonBefore="desc"/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={3} >
                      <Icon className="my-dynamic-delete-button" type={ind === 0 ? "plus-circle-o":"minus-circle-o"}
                        onClick={ind === 0 ?() => this.addDataList():() => this.removeDataList(ind)}/>
                    </Col>
                  </Row>
                ))
              )
            : null
          }
          {
            getFieldValue(`_actions[${getFieldValue('_currentActionName')}].rewriteFields`)&&getFieldValue(`_actions[${getFieldValue('_currentActionName')}].rewriteFields`).indexOf('V') !== -1&&getFieldValue(`_actions[${getFieldValue('_currentActionName')}]._valueRange.type`) === 'STEP'?(
              <div>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('_valueRange.dataStep.dataType', {
                    initialValue: valueRangeDataStep?valueRangeDataStep.dataType:'Integer',
                    rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Select placeholder="数据类型">
                      <Select.Option value="Integer">整型</Select.Option>
                      <Select.Option value="Double">浮点型</Select.Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('_valueRange.dataStep.step', {
                    initialValue: valueRangeDataStep?valueRangeDataStep.step:'',
                    rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Input addonBefore="步长" placeholder="step"/>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('_valueRange.dataStep.minValue', {
                    initialValue: valueRangeDataStep?valueRangeDataStep.minValue:'',
                    rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Input addonBefore="最小值" placeholder="minValue"/>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('_valueRange.dataStep.maxValue', {
                    initialValue: valueRangeDataStep?valueRangeDataStep.maxValue:'',
                    rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Input addonBefore="最大值" placeholder="maxValue"/>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('_valueRange.dataStep.transform.k', {
                    initialValue: valueRangeDataStep&&valueRangeDataStep.transform?valueRangeDataStep.transform.k:'',
                    // rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Input addonBefore="线性变换参数-k" placeholder="transform.k"/>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('_valueRange.dataStep.transform.c', {
                    initialValue: valueRangeDataStep&&valueRangeDataStep.transform?valueRangeDataStep.transform.c:'',
                    // rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Input addonBefore="线性变换参数-c" placeholder="transform.c"/>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('_valueRange.dataStep.fallback', {
                    initialValue: valueRangeDataStep?valueRangeDataStep.fallback:'',
                  })(
                    <Input addonBefore="超限后的替换值" placeholder="fallback"/>
                  )}
                </Form.Item>
              </div>
            ):null
          }
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ActionsForm)
