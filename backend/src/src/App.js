import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import 'semantic-ui-css/semantic.min.css'
import BaseRouter from './routes';
import CustomLayout from './containers/Layout';
import * as actions from './store/actions/auth';

class App extends Component {

  componentDidMount(){
    this.props.onTryAutoSignup();
  }

  render(){
    return (
      <div>
        <Router>
          <CustomLayout {...this.props}>
            <BaseRouter />
          </CustomLayout>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}

const mapDispatchToPops = dispatch => {
  return{
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToPops)(App);
