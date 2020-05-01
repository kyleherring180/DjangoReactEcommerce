import React, { Component } from 'react';
import { Button, Form, Grid, Header, Message, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { NavLink, Redirect } from "react-router-dom";
import { authLogin } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";

class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;
    this.props.login(username, password);
    this.props.fetchCart();
  };

  render(){
    const { error, loading, token } = this.props;
    const { username, password } = this.state;

    if (token) {
      return <Redirect to="/" />;
    }

    let errorMessage = null;
    if (error){
      errorMessage = (
          <p>{error.message}</p>
      );
    }
    return (
      <div>
      {errorMessage}
      {
        loading ?
        <Segment>
          <Dimmer active>
            <Loader size='big'>Loading</Loader>
          </Dimmer>
        </Segment>
        :
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='violet' textAlign='center'>
               Log-in to your account
            </Header>
            <Form size='large' onSubmit={this.handleSubmit}>
              <Segment stacked>
              <Form.Input
                onChange={this.handleChange}
                value={username}
                name="username"
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Username"
              />
              <Form.Input
                onChange={this.handleChange}
                fluid
                value={password}
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />

                <Button color='violet' fluid size='large'>
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us? <NavLink to='/signup'>Sign Up</NavLink>
            </Message>
          </Grid.Column>
        </Grid>
      }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) => dispatch(authLogin(username, password)),
    fetchCart: () => dispatch(fetchCart())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
