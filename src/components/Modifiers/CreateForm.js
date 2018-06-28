import * as React from 'react'
import { Component } from 'react'
import { keys, isInteger } from 'lodash'

import { Modal, Form, Input, Select, Radio, Checkbox } from 'antd'

import typeof modifierType from '../../store/Modifiers'

const formItemLayout: any = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  },
}

class CreateForm extends Component<{attributes: any, modifier: modifierType | null, form: any, visible: boolean, onCancel: any, onConfirm: any}> {

  validatorNumber = (rule, value, callback) => {
    if (!isInteger(Number(value))) {
      callback(`${value} 不是整数`);
    }
    callback();
  }

  render() {
    const { modifier, visible, onCancel, onConfirm, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const attributes = this.props.attributes || []

    getFieldDecorator('id', { initialValue: (modifier&&modifier.id)?modifier.id:null });

    const getConditionsOptions = (attributes, name) => {
      const attributeArr = attributes.filter((attribute) => attribute.name === name);
      if (!attributeArr || attributeArr.length === 0) {
        return '';
      }
      if (attributeArr[0].valueRange.type === 'LIST') {
        return (attributeArr[0].valueRange.dataList.map((dataListItem) => (<Select.Option key={dataListItem.data} value={dataListItem.data}>{dataListItem.data}</Select.Option>)));
      }
      if (attributeArr[0].valueRange.type === 'STEP') {
        const dataStep = attributeArr[0].valueRange.dataStep;
        const valueArr = [];
        for (let i = Number(dataStep.minValue); i <= Number(dataStep.maxValue); i = i + Number(dataStep.step)) {
          valueArr.push(i);
        }
        return (valueArr.map((dataStepItem) => (<Select.Option key={dataStepItem} value={dataStepItem}>{dataStepItem}</Select.Option>)));
      }
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
          <Form.Item label="优先级" {...formItemLayout}>
            {getFieldDecorator('priority', {
              initialValue: modifier?modifier.priority:'',
              rules: [{validator: this.validatorNumber}],
            })(
              <Input placeholder="priority" />
            )}
          </Form.Item>
          <Form.Item label="触发器运算符" {...formItemLayout}>
            {getFieldDecorator('trigger.operator', {
              initialValue: (modifier&&modifier.trigger)?modifier.trigger.operator:'',
              rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Select>
                <Select.Option value="AND">AND</Select.Option>
                <Select.Option value="OR">OR</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="触发器条件" {...formItemLayout}>
            {getFieldDecorator('_operatorType', {
              initialValue: (modifier&&modifier.trigger&&modifier.trigger.alarms)?'alarms':'conditions',
              rules: [{ required: true, message: '不允许为空!' }],
              // valuePropName: 'checked'
            })(
              <Radio.Group>
                <Radio.Button value="conditions">属性条件</Radio.Button>
                <Radio.Button value="alarms">报警条件</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>
          {
            getFieldValue('_operatorType') === 'conditions'
            ? (
                <div>
                  {getFieldDecorator('_selectAttrList', {
                    initialValue: keys((modifier&&modifier.trigger)?modifier.trigger.conditions:{}),
                    // valuePropName: 'checked'
                  })(
                    <Checkbox.Group options={attributes.filter((item) => item.valueRange.type==='LIST' || item.valueRange.type==='STEP').map((attribute) => {return {label: attribute.name, value: attribute.name}})} />
                  )}
                  {getFieldValue('_selectAttrList').map((item, index) => (
                    <div key={item} >
                      {
                        `当${item}的值为：`
                      }
                      {
                        getFieldDecorator(`_conditions[${item}].values`, {
                          initialValue: (modifier&&modifier.trigger&&modifier.trigger.conditions&&modifier.trigger.conditions[item])?modifier.trigger.conditions[item].slice():[],
                          rules: [{ required: true, message: '不允许为空!' }],
                        })(
                          <Select mode="multiple" style={{width: '300px'}}>
                            {
                              getConditionsOptions(attributes, item)
                            }
                          </Select>
                        )
                      }
                    </div>
                  ))}
                </div>
              )
            : null
          }
          {
            getFieldValue('_operatorType') === 'alarms'
            ? (
                <div>
                  {getFieldDecorator('trigger.alarms', {
                    initialValue: (modifier&&modifier.trigger&&modifier.trigger.alarms)?modifier.trigger.alarms.slice():[],
                    // valuePropName: 'checked'
                  })(
                    <Checkbox.Group options={[{label: 'kAnyDeviceAlarm', value: 'kAnyDeviceAlarm'}]} />
                  )}
                </div>
              )
            : null
          }
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(CreateForm)
