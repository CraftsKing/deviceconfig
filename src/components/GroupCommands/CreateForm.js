import * as React from 'react'
import { Component } from 'react'

import { Modal, Form, Input, Transfer } from 'antd'

import typeof groupCommandType from '../../store/GroupCommands'
import typeof attributeType from '../../store/Attributes'

const formItemLayout: any = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 22
  },
}

class CreateForm extends Component<{ attributes: Array<attributeType>, groupCommand: groupCommandType | null, form: any, visible: boolean, onCancel: any, onConfirm: any}> {

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    const { form } = this.props;
    form.setFieldsValue({
      attrNameList: nextTargetKeys
    });
  }

  render() {
    const { attributes, groupCommand, visible, onCancel, onConfirm, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const dataSource: any = [];
    if (attributes && attributes.length > 0) {
      attributes.map((item, index) => {
        dataSource.push({...item, key: item.name});
        return true;
      });
    }

    getFieldDecorator('id', { initialValue: (groupCommand&&groupCommand.id)?groupCommand.id:null });
    getFieldDecorator('attrNameList', { initialValue: (groupCommand&&groupCommand.attrNameList)?groupCommand.attrNameList.slice():[] });
    getFieldDecorator('_attrNameList', { initialValue: (groupCommand&&groupCommand.attrNameList)?groupCommand.attrNameList.slice():[] });

    return (
      <Modal
        visible={visible}
        title={groupCommand?'修改':'添加'}
        okText="确定"
        onCancel={onCancel}
        onOk={onConfirm}
      >
        <Form layout="vertical">
          <Form.Item label="组命令名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: groupCommand?groupCommand.name:'',
              rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Input placeholder="name" />
            )}
          </Form.Item>
          <Form.Item label="指令代码" {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: groupCommand?groupCommand.code:'',
            })(
              <Input placeholder="code" />
            )}
          </Form.Item>
          <Form.Item label="组命令描述" {...formItemLayout}>
            {getFieldDecorator('desc', {
              initialValue: groupCommand?groupCommand.desc:'',
            })(
              <Input placeholder="desc" />
            )}
          </Form.Item>
          <Form.Item label="属性名数组" {...formItemLayout}>
            {getFieldDecorator('_attrNameList', {
              rules: [{ required: true, type: 'array', message: '不允许为空!' }],
            })(
              <Transfer
                dataSource={dataSource}
                titles={['可选属性', '已选属性']}
                targetKeys={getFieldValue('attrNameList')?getFieldValue('attrNameList').slice():[]}
                onChange={this.handleChange}
                render={item => `${item.name}-${item.desc}`}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(CreateForm)
