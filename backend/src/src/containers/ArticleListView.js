import React from 'react';
import axios from 'axios';
import {
  Container, Message
} from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import Articles from '../components/Article';
import CustomForm from '../components/Form';

class ArticleList extends React.Component {

  state = {
    articles: []
  }

  componentDidUpdate(newProps){
    if (newProps.token){
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: newProps.token
      }
    }
    axios.get('http://127.0.0.1:8000/api/')
      .then(res =>{
        this.setState({
          articles: res.data
        });
      })
  }

  componentDidMount(){
    axios.get('http://127.0.0.1:8000/api/')
      .then(res =>{
        this.setState({
          articles: res.data
        });
      })
  }

  render (){
    return (
      <div>
        <Container>
          <Articles data={this.state.articles}/>
          <br />
          <h2>Create an Article</h2>
          { this.props.authenticated ?
            <CustomForm
              requestType="post"
              articleID={null}
              btnText="Create"/>
          :
          <Message>
            Please <NavLink to='/login'>Login</NavLink> to create an Article
          </Message>
          }


        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.token,
    authenticated: state.token !== null,
  };
};

export default connect(mapStateToProps)(ArticleList);
