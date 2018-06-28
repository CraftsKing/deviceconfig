import * as React from 'react'
import { Component } from 'react'

import { Modal, Form, Input, Radio, Select } from 'antd'

import typeof constraintType from '../../store/Constraints'

const formItemLayout: any = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  },
}

const getCurrentAction = (constraint, name) => {
  let action = {
    name: name,
    value: null
  };
  if (constraint && constraint.additionalCommands && constraint.additionalCommands.commands && name) {
    const actionArr = constraint.additionalCommands.commands.filter((item) => item.name === name);
    if (actionArr && actionArr.length > 0) {
      action.value = actionArr[0].value;
    }
  }
  return action;
}

class ActionsForm extends Component<{attributes: any, constraint: constraintType | null, mergeType: string, form: any, visible: boolean, onCancel: any, onConfirm: any}> {

  nameOnChange = (value) => {
    const { form } = this.props;
    // important! notify form to detect changes
    form.setFieldsValue({
      '_currentActionName': value
    });
  }

  render() {
    const { constraint, mergeType, visible, onCancel, onConfirm, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const attributes = this.props.attributes || []

    getFieldDecorator('id', { initialValue: (constraint&&constraint.id)?constraint.id:null });
    getFieldDecorator('_currentActionName', { initialValue: (constraint&&constraint.additionalCommands&&constraint.additionalCommands.commands&&constraint.additionalCommands.commands.slice())?constraint.additionalCommands.commands.slice()[0].name:'' });

    const getConditionsOptions = (attributes, name) => {
      const attributeArr = attributes.filter((attribute) => attribute.name === name);
      if (!attributeArr || attributeArr.length === 0) {
        return null;
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
      >
        <Form>
          {
            constraint
            ? (
                <Form.Item label="已有的commands" {...formItemLayout}>
                  {getFieldDecorator('_currentActionName_abandon', {
                    initialValue: (constraint&&constraint.additionalCommands&&constraint.additionalCommands.commands&&constraint.additionalCommands.commands.slice())?constraint.additionalCommands.commands.slice()[0].name:'',
                  })(
                    <Radio.Group size="small" onChange={(e) => this.nameOnChange(e.target.value)}>
                      {
                        (constraint&&constraint.additionalCommands&&constraint.additionalCommands.commands)
                        ? constraint.additionalCommands.commands.slice().map((action) => (
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
            constraint
            ? (
                <Form.Item label="command名称" {...formItemLayout}>
                  {getFieldDecorator(`_actions[${getFieldValue('_currentActionName')}].name`, {
                    initialValue: getFieldValue('_currentActionName')||'_test_',
                    rules: [{ required: true, message: '不允许为空!' }],
                  })(
                    <Input disabled/>
                  )}
                </Form.Item>
              )
            : (
                <Form.Item label="command名称" {...formItemLayout}>
                  {getFieldDecorator(`_actions[${getFieldValue('_currentActionName')}].name`, {
                    initialValue: (getFieldValue('_currentActionName'))?(getFieldValue('_currentActionName')):'请选择',
                    rules: [{ required: true, message: '不允许为空!' }],
                  })(
                    <Select onSelect={(value) => this.nameOnChange(value)}>
                      {
                        attributes.map((attribute) => (
                          <Select.Option key={attribute.name} value={attribute.name}>{attribute.name}</Select.Option>
                        ))
                      }
                    </Select>
                  )}
                </Form.Item>
              )
          }
          
          <Form.Item label="合并方式" {...formItemLayout}>
            {getFieldDecorator('_mergeType', {
              initialValue: mergeType,
              rules: [{ required: true, message: '不允许为空!' }],
            })(
              <Select disabled={!!mergeType}>
                <Select.Option value="REPLACE">替换待下发命令</Select.Option>
                <Select.Option value="PREPEND">置于队列头</Select.Option>
                <Select.Option value="APPEND">插入队尾</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="command值" {...formItemLayout}>
            {getFieldDecorator(`_actions[${getFieldValue('_currentActionName')}].value`, {
              initialValue: getCurrentAction(constraint, getFieldValue('_currentActionName')).value,
              rules: [{ required: true, message: '不允许为空!' }],
            })(
              <Select style={{width: '300px'}}>
                {
                  getConditionsOptions(attributes, getFieldValue('_currentActionName'))
                }
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ActionsForm)
