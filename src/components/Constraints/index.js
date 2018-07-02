// @flow
import * as React from 'react'
import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { keys } from 'lodash'

import { default as CreateForm } from './CreateForm'
import { default as ActionsForm } from './ActionsForm'

import { Row, Col, Table, Button, Divider } from 'antd';

import './index.css';

import typeof constraintType from '../../store/Constraints'
import typeof otherType from '../../store/Other'

type State = {
  selectConstraints: Array<constraintType>,
  formVisiable: boolean,
  actionsformVisiable: boolean,
  currentConstraint: constraintType | null,
  currentConstraintCopy: constraintType | null
};

type ConstraintsType = {
  constraints: Array<constraintType>,
  removeConstraintsByNameList: any,
  addOrUpdateConstraint: any,
  getConstraints: any,
};

type AttributesType = {
  getAttributes: any,
};

@inject(allStores => ({
    Constraints: allStores.Constraints,
    Attributes: allStores.Attributes,
    Other: allStores.Other
}))
@observer
export default class Constraints extends Component<{Attributes: AttributesType, Constraints: ConstraintsType, Other: otherType, history: any}, State> {
  state: any = {
    selectConstraints: [],
    formVisiable: false,
    actionsformVisiable: false,
    currentConstraint: null,
    currentConstraintCopy: null
  }

  columns: any = [{
    title: '触发条件',
    dataIndex: 'pendingCondition',
    key: 'pendingCondition',
    render: (text) => (<pre>{`${JSON.stringify(text, null, 2)}`}</pre>)
  }, {
    title: 'commands操作数组',
    dataIndex: 'commands',
    key: 'commands',
    render: (text, record) => (
      <span>
        <a onClick={() => this.handleAddActions(record)}>添加command</a>
        <Divider type="vertical" />
        <a onClick={() => this.handleUpdateActions(record)}>编辑commands</a>
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
    this.props.history.push('/preview');
  }

  selectOnChange = (selectedRowKeys: any, selectedRows: any) => {
    this.setState({selectConstraints: selectedRows});
  }

  handleUpdate = (item: constraintType) => {
    this.setState({ formVisiable: true, currentConstraint: item, currentConstraintCopy: item });
  }

  handleUpdateActions = (item: constraintType) => {
    this.setState({ actionsformVisiable: true, currentConstraint: item, currentConstraintCopy: item });
  }
  handleAddActions = (item: constraintType) => {
    this.setState({ actionsformVisiable: true, currentConstraint: null, currentConstraintCopy: item });
  }

  handleAddClick = () => {
    this.setState({ formVisiable: true });
  }

  handleDeleteClick = () => {
    const nameArr:Array<string> = this.state.selectConstraints.map((item) => item.name);
    this.props.Constraints.removeConstraintsByNameList(nameArr);
    this.setState({selectConstraints: []});
  }

  handleConcel = () => {
    // $FlowFixMe
    const form: any = this.formRef.props.form;
    form.resetFields();
    this.setState({ formVisiable: false, currentConstraint: null, currentConstraintCopy: null });
  }
  handleActionsConcel = () => {
    // $FlowFixMe
    const form: any = this.actionsFormRef.props.form;
    form.resetFields();
    this.setState({ actionsformVisiable: false, currentConstraint: null, currentConstraintCopy: null });
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
      // const constraintObj = {
      //   pendingCondition: null,
      //   additionalCommands: self.state.currentConstraint?self.state.currentConstraint.additionalCommands:null,,
      // };
      // if (values.id) {
      //   constraintObj.id = values.id;
      // }
      const pendingConditionObj = values.pendingCondition;

      const conditionNameArr = keys(values._conditions);
      const tempObj = {};
      for (let i = 0; i < conditionNameArr.length; i++) {
        const name = conditionNameArr[i];
        if (name && name !== 'undefined' && values._conditions[name]) {
          
          if (values._conditions[name].different) {
            tempObj[name] = ['kDifferentValue'];
          } else {
            tempObj[name] = values._conditions[name].values;
          }
        }
      }
      pendingConditionObj.commands = {...tempObj};
      self.props.Constraints.addOrUpdateConstraint({ id: values.id, pendingCondition: pendingConditionObj, additionalCommands: self.state.currentConstraint?self.state.currentConstraint.additionalCommands:null });
      form.resetFields();
      self.setState({ formVisiable: false, currentConstraint: null, currentConstraintCopy: null });
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
      const originActions = self.state.currentConstraintCopy.additionalCommands?self.state.currentConstraintCopy.additionalCommands.commands.slice():[''];
      const actions = values._actions;
      const namesArr = keys(actions);
      
      for (let i = 0; i < namesArr.length; i++) {
        const nameItem = namesArr[i];
        if (nameItem && nameItem !== 'undefined' && nameItem !== '请选择' && actions[nameItem] && actions[nameItem].name) {
          const tempAction = {
            name: actions[nameItem].name,
            value: actions[nameItem].value,
          };
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
      self.props.Constraints.addOrUpdateConstraint({...self.state.currentConstraintCopy, additionalCommands: { mergeType: values._mergeType, commands: actionsList }});
      form.resetFields();
      self.setState({ actionsformVisiable: false, currentConstraint: null, currentConstraintCopy: null });
    });
  }

  render() {
    const constraints: Array<constraintType> = this.props.Constraints.getConstraints() || [];

    return (
      <div className="form-attributes-wraper">
        <Table columns={this.columns} dataSource={constraints} rowSelection={{onChange: this.selectOnChange}} pagination={false} rowKey='id' bordered/>
        <Row type="flex" justify="center" className="form-attributes-bottom-button-row">
          <Col span={4} >
            <Button type="primary" icon="plus" ghost onClick={() => this.handleAddClick()}>添加</Button>
          </Col>
          <Col span={4} >
            {
              this.state.selectConstraints.length>0?<Button type="danger" icon="delete" ghost onClick={() => this.handleDeleteClick()}>删除</Button>:<span></span>
            }
          </Col>
          <Col span={4} offset={2}>
            <Button type="primary" onClick={this.lastStep}>上一步</Button>
          </Col>
          <Col span={4} >
            <Button type="primary" onClick={() => this.nextStep()}>预览</Button>
          </Col>
        </Row>
        <CreateForm attributes={this.props.Attributes.getAttributes()} constraint={this.state.currentConstraint} visible={this.state.formVisiable} wrappedComponentRef={(formRef: any) => this.saveFormRef(formRef)}
         onCancel={() => this.handleConcel()} onConfirm={() => this.handleConfirm()} />
        <ActionsForm mergeType={(this.state.currentConstraintCopy&&this.state.currentConstraintCopy.additionalCommands)?this.state.currentConstraintCopy.additionalCommands.mergeType:null} attributes={this.props.Attributes.getAttributes()} constraint={this.state.currentConstraint} visible={this.state.actionsformVisiable} wrappedComponentRef={(formRef: any) => this.saveActionsFormRef(formRef)}
         onCancel={() => this.handleActionsConcel()} onConfirm={() => this.handleActionsConfirm()} />
      </div>
    );
  }
}
