import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
// import { inject, observer } from 'mobx-react';

// import Login from './containers/Login'
import Home from './containers/Home'
import Edit from './containers/Edit'
import Preview from './containers/Preview'
import NotFound from './containers/NotFound'
import Header from './components/Header';

@withRouter
export default class App extends React.Component {

  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (<div>
      <Header></Header>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/home" component={Home}/>
        <Route path="/edit" component={Edit}/>
        <Route path="/preview" component={Preview}/>
        <Route component={NotFound}/>
      </Switch>
    </div>);
  }
}
