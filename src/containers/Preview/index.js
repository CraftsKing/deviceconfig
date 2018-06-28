import * as React from 'react'
import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Row, Col, Button } from 'antd';

import './index.css';

@inject(allStores => ({
    MetaData: allStores.MetaData,
    BaseInfo: allStores.BaseInfo,
    Attributes: allStores.Attributes,
    Alarms: allStores.Alarms,
    GroupCommands: allStores.GroupCommands,
    Modifiers: allStores.Modifiers,
    Constraints: allStores.Constraints,
}))
@observer
class App extends Component {

  render() {

    const { MetaData, BaseInfo, Attributes, Alarms, GroupCommands, Modifiers, Constraints } = this.props

    const temp = JSON.stringify({metadata: MetaData, baseInfo: BaseInfo, attributes: Attributes.getAttributes(), alarms: Alarms.getAlarms(), groupCommand: GroupCommands.getGroupCommands(), modifiers: Modifiers.getModifiers(), constraints: Constraints.getConstraints()}, null, '\t')

    return (
      <div className="preview-wraper">
        <pre>
          {temp}
        </pre>
        <Row justify="" >
          <Col span={24} style={{textAlign: 'center'}}>
            <Button type="primary" onClick={() => this.props.history.push('/edit')}>关闭预览</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
