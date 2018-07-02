import * as React from 'react'
import { Component } from 'react'
import moment from 'moment';
import { clone, isInteger } from 'lodash'

import { Row, Col, Modal, Form, Input, Icon, Select, Switch, Radio, DatePicker } from 'antd'

import typeof attributeType from '../../store/Attributes'

const formItemLayout: any = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 14
  },
}

// type State = {
//   currentValueRangeType: string
// };

class CreateForm extends Component<{attribute: attributeType | null, form: any, visible: boolean, onCancel: any, onConfirm: any}> {
  
  // state = {
  //   currentValueRangeType: (this.props.attribute&&this.props.attribute.valueRange)?this.props.attribute.valueRange.type:null
  // }

  removeCode = (index: number) => {
    const { form } = this.props;
    // can use data-binding to get
    const codes = form.getFieldValue('code');
    // We need at least one passenger
    if (codes.length === 1) {
      return;
    }
    codes.splice(index, 1);
    // can use data-binding to set
    form.setFieldsValue({
      code: codes,
      _code: codes
    });
  }
  removeDataList = (index: number) => {
    const { form } = this.props;
    const valueRange = form.getFieldValue('valueRange');
    const dataList = valueRange.dataList || [];
    if (dataList.length === 1) {
      return;
    }
    dataList.splice(index, 1);
    // can use data-binding to set
    form.setFieldsValue({
      valueRange: valueRange,
      _valueRange: valueRange
    });
  }

  addCode = () => {
    const { form } = this.props;
    // can use data-binding to get
    const codes = form.getFieldValue('code');
    // if (codes.indexOf('null') !== -1) {
    //   return;
    // }
    const nextCodes = codes.concat(['null']);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      code: nextCodes,
    });
  }
  addDataList = () => {
    const { form } = this.props;
    const valueRange = form.getFieldValue('valueRange');
    const dataList = valueRange.dataList || [];
    // for (let i = 0; i < dataList.length; i++) {
    //   const item = dataList[i];
    //   if (!item.data) {
    //     return;
    //   }
    // }
    dataList.push({data: '',code: '', desc: ''});
    // important! notify form to detect changes
    form.setFieldsValue({
      'valueRange': valueRange
    });
  }

  codeItemOnBlur = () => {
    const { form } = this.props;
    // can use data-binding to get
    const codes = form.getFieldValue('_code');
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      code: codes
    });
  }

  valueRangeTypeOnChange = (value: string) => {
    const { form } = this.props;
 
    const name = clone(form.getFieldValue('name'));
    const desc = clone(form.getFieldValue('desc'));
    const code = clone(form.getFieldValue('code'));
    const _code = clone(form.getFieldValue('_code'));
    const defaultValue = clone(form.getFieldValue('defaultValue'));
    const writable = clone(form.getFieldValue('writable'));
    const readable = clone(form.getFieldValue('readable'));
    const operationType = clone(form.getFieldValue('operationType'));
    form.resetFields();
    form.setFieldsValue({
      name: name,
      desc: desc,
      code: code,
      _code: _code,
      _currentValueRangeType: value,
      defaultValue: defaultValue,
      writable: writable,
      readable: readable,
      operationType: operationType
    });
    // this.setState({currentValueRangeType: value});
  }

  dataListOnChange = () => {
    const { form } = this.props;
    // can use data-binding to get
    const valueRange = form.getFieldValue('_valueRange');
    // important! notify form to detect changes
    form.setFieldsValue({
      'valueRange': valueRange
    });
  }

  onDateChange = (dates) => {
    console.log(dates);
    const { form } = this.props;
    // important! notify form to detect changes
    form.setFieldsValue({
      'valueRange.dataDate.beginDate': dates[0].format('YYYYMMDD'),
      'valueRange.dataDate.endDate': dates[1].format('YYYYMMDD'),
    });
  }

  validatorNumber = (rule, value, callback) => {
    if (!isInteger(Number(value))) {
      callback(`${value} 不是整数`);
    }
    callback();
  }

  render() {
    const { attribute, visible, onCancel, onConfirm, form } = this.props
    const { getFieldDecorator, getFieldValue } = form

    getFieldDecorator('id', { initialValue: (attribute&&attribute.id)?attribute.id:null });
    getFieldDecorator('_currentValueRangeType', { initialValue: (attribute&&attribute.valueRange)?attribute.valueRange.type:'NONE' });
    const currentValueRangeType = getFieldValue('_currentValueRangeType');
   

    let valueRangeDataList: any = [];
    if (currentValueRangeType === 'LIST') {
      getFieldDecorator('valueRange.dataList', { initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataList&&attribute.valueRange.dataList.slice().length>0)?attribute.valueRange.dataList.slice():[{data: '',code: '', desc: ''}] });
      valueRangeDataList = getFieldValue('valueRange.dataList');
    }
    if (currentValueRangeType === 'DATE') {
      getFieldDecorator('valueRange.dataDate.beginDate', { initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataDate)?attribute.valueRange.dataDate.beginDate:null });
      getFieldDecorator('valueRange.dataDate.endDate', { initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataDate)?attribute.valueRange.dataDate.endDate:null });
    }

    // code 数组
    getFieldDecorator('code', { initialValue: (attribute&&attribute.code)?attribute.code.slice():[''] });
    const codes = getFieldValue('code');
    const formItems = codes.map((k, index) => {
      return (
        <Form.Item
          label={index === 0 ? '代码数组' : ' '}
          colon={index === 0}
          {...formItemLayout}
          key={k + index}
        >
          {getFieldDecorator(`_code[${index}]`, {
            initialValue: k,
          })(
            <Input onBlur={() => this.codeItemOnBlur()} addonBefore={`code ${index}`} style={{ width: '83%', marginRight: 8 }} placeholder={`code ${index}`}/>
          )}
          {
            (valueRangeDataList && valueRangeDataList.length > 1)?(<Icon className="my-dynamic-delete-button" type={index === 0 && (codes.length < valueRangeDataList.length) ? "plus-circle-o":"minus-circle-o"}
            onClick={index === 0 && (codes.length < valueRangeDataList.length) ?() => this.addCode():() => this.removeCode(index)}/>):null
          }
        </Form.Item>
      );
    });

    return (
      <Modal
        visible={visible}
        title={attribute?'修改':'添加'}
        okText="确定"
        onCancel={onCancel}
        onOk={onConfirm}
      >
        <Form>
          <Form.Item label="属性名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: attribute?attribute.name:'',
              rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
            })(
              <Input placeholder="name" />
            )}
          </Form.Item>
          <Form.Item label="属性描述" {...formItemLayout}>
            {getFieldDecorator('desc', {
              initialValue: attribute&&attribute.desc?`${attribute.desc}`:'',
            })(
              <Input placeholder="desc" />
            )}
          </Form.Item>
          {formItems}
          <Form.Item label="默认值" {...formItemLayout}>
            {getFieldDecorator('defaultValue', {
              initialValue: attribute&&attribute.defaultValue?`${attribute.defaultValue}`:'',
            })(
              <Input placeholder="defaultValue" />
            )}
          </Form.Item>

          <Form.Item label="是否可读" {...formItemLayout}>
            {getFieldDecorator('readable', {
              initialValue: !!attribute&&attribute.readable,
              rules: [{ required: true }],
              valuePropName: 'checked'
            })(
              <Switch />
            )}
          </Form.Item>
          <Form.Item label="是否可写" {...formItemLayout}>
            {getFieldDecorator('writable', {
              initialValue: !!attribute&&attribute.writable,
              rules: [{ required: true }],
              valuePropName: 'checked'
            })(
              <Switch />
            )}
          </Form.Item>

          <Form.Item label="命令类型" {...formItemLayout}>
            {getFieldDecorator('operationType', {
              initialValue: attribute?attribute.operationType:'',
            })(
              <Select placeholder="operationType">
                <Select.Option value="I">单命令</Select.Option>
                <Select.Option value="G">组命令</Select.Option>
                <Select.Option value="IG">单命令\组命令</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="取值范围" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('valueRange.type', {
              initialValue: currentValueRangeType,
              rules: [{ required: true }],
            })(
              <Radio.Group onChange={(e) => this.valueRangeTypeOnChange(e.target.value)}>
                <Radio.Button value="NONE">NONE</Radio.Button>
                <Radio.Button value="LIST">LIST</Radio.Button>
                <Radio.Button value="STEP">STEP</Radio.Button>
                <Radio.Button value="TIME">TIME</Radio.Button>
                <Radio.Button value="DATE">DATE</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>
          {
            getFieldValue('valueRange.type') === 'LIST'?(
              valueRangeDataList.map((item, ind) => (
                <Row type="flex" justify="center" key={item.data}>
                  <Col span={7} >
                    <Form.Item>
                      {getFieldDecorator(`_valueRange.dataList[${ind}.data]`, {
                        initialValue: item.data,
                        rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                      })(
                        <Input onBlur={() => this.dataListOnChange()} addonBefore="data"/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={7} >
                    <Form.Item>
                      {getFieldDecorator(`_valueRange.dataList[${ind}].code`, {
                        initialValue: item.code,
                      })(
                        <Input onBlur={() => this.dataListOnChange()} addonBefore="code"/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={7} >
                    <Form.Item>
                      {getFieldDecorator(`_valueRange.dataList[${ind}].desc`, {
                        initialValue: item.desc,
                      })(
                        <Input onBlur={() => this.dataListOnChange()} addonBefore="desc"/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={3} >
                    <Icon className="my-dynamic-delete-button" type={ind === 0 ? "plus-circle-o":"minus-circle-o"}
                      onClick={ind === 0 ?() => this.addDataList():() => this.removeDataList(ind)}/>
                  </Col>
                </Row>
              ))
            ):null
          }
          {
            getFieldValue('valueRange.type') === 'STEP'?(
              <div>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('valueRange.dataStep.dataType', {
                    initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataStep)?attribute.valueRange.dataStep.dataType:'Integer',
                    rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Select placeholder="数据类型">
                      <Select.Option value="Integer">整型</Select.Option>
                      <Select.Option value="Double">浮点型</Select.Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('valueRange.dataStep.step', {
                    initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataStep)?attribute.valueRange.dataStep.step:'',
                    rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Input addonBefore="步长" placeholder="step"/>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('valueRange.dataStep.minValue', {
                    initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataStep)?attribute.valueRange.dataStep.minValue:'',
                    rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Input addonBefore="最小值" placeholder="minValue"/>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('valueRange.dataStep.maxValue', {
                    initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataStep)?attribute.valueRange.dataStep.maxValue:'',
                    rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Input addonBefore="最大值" placeholder="maxValue"/>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('valueRange.dataStep.transform.k', {
                    initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataStep&&attribute.valueRange.dataStep.transform)?attribute.valueRange.dataStep.transform.k:'',
                    // rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Input addonBefore="线性变换参数-k" placeholder="transform.k"/>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('valueRange.dataStep.transform.c', {
                    initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataStep&&attribute.valueRange.dataStep.transform)?attribute.valueRange.dataStep.transform.c:'',
                    // rules: [{ required: true, whitespace: true, message: '不允许为空!' }],
                  })(
                    <Input addonBefore="线性变换参数-c" placeholder="transform.c"/>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('valueRange.dataStep.fallback', {
                    initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataStep)?attribute.valueRange.dataStep.fallback:'',
                  })(
                    <Input addonBefore="超限后的替换值" placeholder="fallback"/>
                  )}
                </Form.Item>
              </div>
            ):null
          }
          {
            getFieldValue('valueRange.type') === 'TIME'?(
              <div>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('valueRange.dataTime.format', {
                    initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataTime)?attribute.valueRange.dataTime.format:'',
                    rules: [{ required: true }],
                  })(
                    <Select placeholder="时间格式">
                      <Select.Option value="HH:mm:ss">HH:mm:ss</Select.Option>
                      <Select.Option value="HH:mm">HH:mm</Select.Option>
                      <Select.Option value="HH">HH</Select.Option>
                      <Select.Option value="mm">mm</Select.Option>
                    </Select>
                  )}
                </Form.Item>
                {
                  getFieldValue('valueRange.dataTime.format').indexOf('HH') !== -1
                  ? (
                      <div>
                        <Form.Item label=" " colon={false} {...formItemLayout}>
                          {getFieldDecorator('valueRange.dataTime.minHour', {
                            initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataTime&&attribute.valueRange.dataTime.minHour)?Number(attribute.valueRange.dataTime.minHour):'',
                            rules: [{ required: true, message: '整数且不允许为空!' }, {validator: this.validatorNumber}],
                          })(
                            <Input addonBefore="最小小时" placeholder="大于等于0"/>
                          )}
                        </Form.Item>
                        <Form.Item label=" " colon={false} {...formItemLayout}>
                          {getFieldDecorator('valueRange.dataTime.maxHour', {
                            initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataTime&&attribute.valueRange.dataTime.maxHour)?Number(attribute.valueRange.dataTime.maxHour):'',
                            rules: [{ required: true, message: '整数且不允许为空!' }, {validator: this.validatorNumber}],
                          })(
                            <Input addonBefore="最大小时" placeholder="小于等于23"/>
                          )}
                        </Form.Item>
                      </div>
                    )
                  : null
                }
                {
                  getFieldValue('valueRange.dataTime.format').indexOf('mm') !== -1
                  ? (
                      <div>
                        <Form.Item label=" " colon={false} {...formItemLayout}>
                          {getFieldDecorator('valueRange.dataTime.minMinute', {
                            initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataTime&&attribute.valueRange.dataTime.minMinute)?Number(attribute.valueRange.dataTime.minMinute):'',
                            rules: [{ required: true, message: '整数且不允许为空!' }, {validator: this.validatorNumber}],
                          })(
                            <Input addonBefore="最小分钟" placeholder="大于等于0"/>
                          )}
                        </Form.Item>
                        <Form.Item label=" " colon={false} {...formItemLayout}>
                          {getFieldDecorator('valueRange.dataTime.maxMinute', {
                            initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataTime&&attribute.valueRange.dataTime.maxMinute)?Number(attribute.valueRange.dataTime.maxMinute):'',
                            rules: [{ required: true, message: '整数且不允许为空!' }, {validator: this.validatorNumber}],
                          })(
                            <Input addonBefore="最大分钟" placeholder="小于等于59"/>
                          )}
                        </Form.Item>
                      </div>
                    )
                  : null
                }
                {
                  getFieldValue('valueRange.dataTime.format').indexOf('ss') !== -1
                  ? (
                      <div>
                        <Form.Item label=" " colon={false} {...formItemLayout}>
                          {getFieldDecorator('valueRange.dataTime.minSecond', {
                            initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataTime&&attribute.valueRange.dataTime.minSecond)?Number(attribute.valueRange.dataTime.minSecond):'',
                            rules: [{ required: true, message: '整数且不允许为空!' }, {validator: this.validatorNumber}],
                          })(
                            <Input addonBefore="最小秒" placeholder="大于等于0"/>
                          )}
                        </Form.Item>
                        <Form.Item label=" " colon={false} {...formItemLayout}>
                          {getFieldDecorator('valueRange.dataTime.maxSecond', {
                            initialValue: (attribute&&attribute.valueRange&&attribute.valueRange.dataTime&&attribute.valueRange.dataTime.maxSecond)?Number(attribute.valueRange.dataTime.maxSecond):'',
                            rules: [{ required: true, message: '整数且不允许为空!' }, {validator: this.validatorNumber}],
                          })(
                            <Input addonBefore="最大秒" placeholder="小于等于59"/>
                          )}
                        </Form.Item>
                      </div>
                    )
                  : null
                }
              </div>
            ):null
          }
          {
            getFieldValue('valueRange.type') === 'DATE'?(
              <div>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('valueRange.dataDate.format', {
                    initialValue: 'yyyyMMdd',
                    rules: [{ required: true }],
                  })(
                    <Input addonBefore="日期格式" disabled placeholder="format"/>
                  )}
                </Form.Item>
                <Form.Item label=" " colon={false} {...formItemLayout}>
                  {getFieldDecorator('_dataDate', {
                    initialValue: [(attribute&&attribute.valueRange&&attribute.valueRange.dataDate)?moment(attribute.valueRange.dataDate.beginDate, 'YYYYMMDD'):null,
                      (attribute&&attribute.valueRange&&attribute.valueRange.dataDate)?moment(attribute.valueRange.dataDate.endDate, 'YYYYMMDD'):null
                    ],
                    rules: [{ required: true, type: 'array', message: '不允许为空!' }],
                  })(
                    <DatePicker.RangePicker format="YYYYMMDD" onChange={(dates) => this.onDateChange(dates)} />
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

export default Form.create()(CreateForm)
