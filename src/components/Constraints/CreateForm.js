import * as React from 'react'
import { Component } from 'react'
import { keys } from 'lodash'

import { Row, Col, Modal, Form, Select, Checkbox, Switch } from 'antd'

import typeof constraintType from '../../store/Constraints'

const formItemLayout: any = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  },
}

class CreateForm extends Component<{attributes: any, constraint: constraintType | null, form: any, visible: boolean, onCancel: any, onConfirm: any}> {

  render() {
    const { constraint, visible, onCancel, onConfirm, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const attributes = this.props.attributes || []

    getFieldDecorator('id', { initialValue: (constraint&&constraint.id)?constraint.id:null });

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
        title={constraint?'修改':'添加'}
        okText="确定"
        onCancel={onCancel}
        onOk={onConfirm}
        width="800px"
      >
        <Form>
          <Form.Item label="触发器运算符" {...formItemLayout}>
            {getFieldDecorator('pendingCondition.operator', {
              initialValue: (constraint&&constraint.pendingCondition)?constraint.pendingCondition.operator:'',
              rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Select>
                <Select.Option value="AND">AND</Select.Option>
                <Select.Option value="OR">OR</Select.Option>
              </Select>
            )}
          </Form.Item>
            {getFieldDecorator('_selectAttrList', {
              initialValue: keys((constraint&&constraint.pendingCondition)?constraint.pendingCondition.commands:{}),
            })(
              <Checkbox.Group options={attributes.filter((item) => item.valueRange.type==='LIST' || item.valueRange.type==='STEP').map((attribute) => {return {label: attribute.name, value: attribute.name}})} />
            )}
            {getFieldValue('_selectAttrList').map((item, index) => (
              <Row key={item} type="flex" justify="center" className="form-attributes-bottom-button-row">
                <Col span={4} >
                  {
                    `当${item}的值与之前状态值不同:`
                  }
                </Col>
                <Col span={2} >
                  {
                    getFieldDecorator(`_conditions[${item}].different`, {
                      initialValue: (constraint&&constraint.pendingCondition&&constraint.pendingCondition.commands&&constraint.pendingCondition.commands[item]&&constraint.pendingCondition.commands[item].slice()[0])?constraint.pendingCondition.commands[item].slice()[0] === 'kDifferentValue':false,
                      valuePropName: 'checked'
                    })(
                      <Switch />
                    )
                  }
                </Col>
                <Col span={2} >
                  {
                    `或者值为:`
                  }
                </Col>
                <Col span={16} >
                  {
                    !getFieldValue(`_conditions[${item}].different`)
                    ? 
                      getFieldDecorator(`_conditions[${item}].values`, {
                        initialValue: (constraint&&constraint.pendingCondition&&constraint.pendingCondition.commands&&constraint.pendingCondition.commands[item]&&constraint.pendingCondition.commands[item].slice())?constraint.pendingCondition.commands[item].slice().filter((item) => item !== 'kDifferentValue'):[],
                        rules: [{ required: true, message: '不允许为空!' }],
                      })(
                        <Select mode="multiple" style={{width: '300px'}}>
                          {
                            getConditionsOptions(attributes, item)
                          }
                        </Select>
                      )
                    : null
                  }
                </Col>
              </Row>
            ))}
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(CreateForm)
