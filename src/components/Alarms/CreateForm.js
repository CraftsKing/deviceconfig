import * as React from 'react'
import { Component } from 'react'

import { Modal, Form, Input } from 'antd'

import typeof alarmType from '../../store/Alarms'

const formItemLayout: any = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 14
  },
}

class CreateForm extends Component<{alarm: alarmType | null, form: any, visible: boolean, onCancel: any, onConfirm: any}> {

  render() {
    const { alarm, visible, onCancel, onConfirm, form } = this.props
    const { getFieldDecorator } = form

    getFieldDecorator('id', { initialValue: (alarm&&alarm.id)?alarm.id:null });
    
    return (
      <Modal
        visible={visible}
        title={alarm?'修改':'添加'}
        okText="确定"
        onCancel={onCancel}
        onOk={onConfirm}
      >
        <Form>
          <Form.Item label="报警名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: alarm?alarm.name:'',
              rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Input placeholder="name" />
            )}
          </Form.Item>
          <Form.Item label="指令代码" {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: alarm?alarm.code:'',
            })(
              <Input placeholder="code" />
            )}
          </Form.Item>
          <Form.Item label="详细报警信息描述" {...formItemLayout}>
            {getFieldDecorator('desc', {
              initialValue: alarm?alarm.desc:'',
            })(
              <Input placeholder="desc" />
            )}
          </Form.Item>
          <Form.Item label="清除标志" {...formItemLayout}>
            {getFieldDecorator('clear', {
              initialValue: alarm?alarm.clear:'',
            })(
              <Input placeholder="clear" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(CreateForm)
