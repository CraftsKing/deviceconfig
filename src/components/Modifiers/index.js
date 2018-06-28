// @flow
import * as React from 'react'
import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { keys, join, replace } from 'lodash'

import { default as CreateForm } from './CreateForm'
import { default as ActionsForm } from './ActionsForm'

import { Row, Col, Table, Button, Divider } from 'antd';

import './index.css';

import typeof modifierType from '../../store/Modifiers'
import typeof otherType from '../../store/Other'

type State = {
  selectModifiers: Array<modifierType>,
  formVisiable: boolean,
  actionsformVisiable: boolean,
  currentModifier: modifierType | null
};

type ModifiersType = {
  modifiers: Array<modifierType>,
  removeModifiersByNameList: any,
  addOrUpdateModifier: any,
  getModifiers: any,
};

type AttributesType = {
  getAttributes: any,
};

@inject(allStores => ({
    Modifiers: allStores.Modifiers,
    Attributes: allStores.Attributes,
    Other: allStores.Other
}))
@observer
export default class Modifiers extends Component<{Attributes: AttributesType, Modifiers: ModifiersType, Other: otherType}, State> {
  state: any = {
    selectModifiers: [],
    formVisiable: false,
    actionsformVisiable: false,
    currentModifier: null,
    currentModifierCopy: null
  }

  columns: any = [{
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority'
  }, {
    title: '触发器',
    dataIndex: 'trigger',
    key: 'trigger',
    render: (text) => (<pre>{`${JSON.stringify(text, null, '\t')}`}</pre>)
  }, {
    title: 'actions操作数组',
    dataIndex: 'actions',
    key: 'actions',
    render: (text, record) => (
      <span>
        <a onClick={() => this.handleAddActions(record)}>添加action</a>
        <Divider type="vertical" />
        <a onClick={() => this.handleUpdateActions(record)}>编辑actions</a>
      </span>
    )
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
    this.setState({selectModifiers: selectedRows});
  }

  handleUpdate = (item: modifierType) => {
    this.setState({ formVisiable: true, currentModifier: item, currentModifierCopy: item });
  }

  handleUpdateActions = (item) => {
    this.setState({ actionsformVisiable: true, currentModifier: item, currentModifierCopy: item });
  }
  handleAddActions = (item) => {
    this.setState({ actionsformVisiable: true, currentModifier: null, currentModifierCopy: item });
  }

  handleAddClick = () => {
    this.setState({ formVisiable: true });
  }

  handleDeleteClick = () => {
    const nameArr:Array<string> = this.state.selectModifiers.map((item) => item.name);
    this.props.Modifiers.removeModifiersByNameList(nameArr);
    this.setState({selectModifiers: []});
  }

  handleConcel = () => {
    // $FlowFixMe
    const form: any = this.formRef.props.form;
    form.resetFields();
    this.setState({ formVisiable: false, currentModifier: null, currentModifierCopy: null });
  }
  handleActionsConcel = () => {
    // $FlowFixMe
    const form: any = this.actionsFormRef.props.form;
    form.resetFields();
    this.setState({ actionsformVisiable: false, currentModifier: null, currentModifierCopy: null });
  }

  saveFormRef = (formRef: any) => {
    // $FlowFixMe
    this.formRef = formRef;
  }
  saveActionsFormRef = (formRef: any) => {
    // $FlowFixMe
    this.actionsFormRef = formRef;
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
      const conditionsObj = {
        priority: Number(values.priority),
        trigger: {
          operator: values.trigger.operator,
        },
        actions: self.state.currentModifier?self.state.currentModifier.actions:null,
      };
      if (values.id) {
        conditionsObj.id = values.id;
      }
      const conditionNameArr = keys(values._conditions);
      const tempObj = {};
      for (let i = 0; i < conditionNameArr.length; i++) {
        const name = conditionNameArr[i];
        if (name && name !== 'undefined' && values._conditions[name] && values._conditions[name].values && values._conditions[name].values.length>0 && values._operatorType === 'conditions') {
          // conditionsObj.trigger.conditions[name] = values._conditions[name].values;
          // conditionsObj.trigger = {
          //   operator: conditionsObj.trigger.operator,
          //   conditions: {
          //     [name]: values._conditions[name].values
          //   }
          // };
          tempObj[name] = values._conditions[name].values;
        }
      }
      conditionsObj.trigger.conditions = {...tempObj};
      self.props.Modifiers.addOrUpdateModifier(conditionsObj);
      form.resetFields();
      self.setState({ formVisiable: false, currentModifier: null, currentModifierCopy: null });
    });
  }
  handleActionsConfirm = () => {
    // $FlowFixMe
    const form: any = this.actionsFormRef.props.form;
    const self: any = this;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      const actionsList = [];
      const originActions = self.state.currentModifierCopy.actions?self.state.currentModifierCopy.actions.slice():[''];
      const actions = values._actions;
      const namesArr = keys(actions);
      
      for (let i = 0; i < namesArr.length; i++) {
        const nameItem = namesArr[i];
        if (nameItem && nameItem !== 'undefined' && nameItem !== '请选择' && actions[nameItem] && actions[nameItem].name && actions[nameItem].rewriteFields) {
          const tempAction = {
            name: actions[nameItem].name,
            rewriteFields: replace(join(actions[nameItem].rewriteFields), ',')
          };
          if (actions[nameItem].defaultValue) {
            tempAction.defaultValue = actions[nameItem].defaultValue;
          }
          if (typeof actions[nameItem].writable === 'boolean') {
            tempAction.writable = actions[nameItem].writable;
          }
          if (actions[nameItem]._valueRange && actions[nameItem]._valueRange.type && values._valueRange) {
            tempAction.valueRange = {
              type: actions[nameItem]._valueRange.type,
              ...values._valueRange
            };
          }
          actionsList.push(tempAction);
        } else {
          delete actions[nameItem];
        }
      }
      const namesArrNew = keys(actions);
      for (let j = 0; j < originActions.length; j++) {
        const originAction = originActions[j];
        if (originAction && originAction.name && namesArrNew.indexOf(originAction.name) === -1) {
          actionsList.push(originAction);
        }
      }
      console.log(self.state.currentModifierCopy);
      self.props.Modifiers.addOrUpdateModifier({...self.state.currentModifierCopy, actions: actionsList});
      form.resetFields();
      self.setState({ actionsformVisiable: false, currentModifier: null, currentModifierCopy: null });
    });
  }

  render() {
    const modifiers: Array<modifierType> = this.props.Modifiers.getModifiers() || [];

    return (
      <div className="form-attributes-wraper">
        <Table columns={this.columns} dataSource={modifiers} rowSelection={{onChange: this.selectOnChange}} pagination={false} rowKey='id' bordered/>
        <Row type="flex" justify="center" className="form-attributes-bottom-button-row">
          <Col span={4} >
            <Button type="primary" icon="plus" ghost onClick={() => this.handleAddClick()}>添加</Button>
          </Col>
          <Col span={4} >
            {
              this.state.selectModifiers.length>0?<Button type="danger" icon="delete" ghost onClick={() => this.handleDeleteClick()}>删除</Button>:<span></span>
            }
          </Col>
          <Col span={4} offset={2}>
            <Button type="primary" onClick={this.lastStep}>上一步</Button>
          </Col>
          <Col span={4} >
            <Button type="primary" onClick={this.nextStep}>下一步</Button>
          </Col>
        </Row>
        <CreateForm attributes={this.props.Attributes.getAttributes()} modifier={this.state.currentModifier} visible={this.state.formVisiable} wrappedComponentRef={(formRef: any) => this.saveFormRef(formRef)}
         onCancel={() => this.handleConcel()} onConfirm={() => this.handleConfirm()} />
        <ActionsForm attributes={this.props.Attributes.getAttributes()} modifier={this.state.currentModifier} visible={this.state.actionsformVisiable} wrappedComponentRef={(formRef: any) => this.saveActionsFormRef(formRef)}
         onCancel={() => this.handleActionsConcel()} onConfirm={() => this.handleActionsConfirm()} />
      </div>
    );
  }
}
