import * as React from 'react'
import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Row, Col, Steps } from 'antd';
import './index.css';

import typeof otherType from '../../store/Other'

type stepItemType = {
  title: string,
  description: string,
  component: any
}

const stepList: Array<stepItemType> = [{
  title: 'metadata',
  description: '元数据信息',
  component: require('../../components/MetaData').default
}, {
  title: 'baseInfo',
  description: '设备基本信息',
  component: require('../../components/BaseInfo').default
}, {
  title: 'attributes',
  description: '设备属性信息',
  component: require('../../components/Attributes').default
}, {
  title: 'alarms',
  description: '设备报警信息',
  component: require('../../components/Alarms').default
}, {
  title: 'groupCommand',
  description: '设备组命令信息',
  component: require('../../components/GroupCommands').default
}, {
  title: 'modifiers',
  description: '设备逻辑修正器',
  component: require('../../components/Modifiers').default
}, {
  title: 'constraints',
  description: '命令补丁器数组',
  component: require('../../components/Constraints').default
}];

@inject(allStores => ({
    Other: allStores.Other
}))
@observer
class App extends Component<{ Other: otherType }> {

  render() {

    const currentStep: $PropertyType<otherType, 'currentStep'> = this.props.Other.currentStep;
    const currentStepItem: stepItemType = stepList[currentStep];

    return (
      <div className="edit-wraper">
        <Row>
          <Col span={4}>
            <div className="edit-left-step">
              <Steps direction="vertical" current={currentStep}>
                {
                  stepList.map((item, index) => (
                    <Steps.Step key={index} title={item.title} description={item.description} />
                  ))
                }
              </Steps>
            </div>
          </Col>
          <Col span={20}>
            <div className="edit-right-step-content">
              <currentStepItem.component {...this.props}/>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
