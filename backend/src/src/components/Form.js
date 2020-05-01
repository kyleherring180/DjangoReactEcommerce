import React from 'react';
import { Button, Form } from 'semantic-ui-react'
import { connect } from 'react-redux';
import axios from 'axios';

// const FormItem = Form.Item;

class CustomForm extends React.Component {

    handleFormSubmit = (event, requestType, articleID) => {
      const title = event.target.elements.title.value;
      const content = event.target.elements.content.value;

      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: this.props.token
      }

      switch(requestType){
        case 'post':
          return axios.post('http://127.0.0.1:8000/api/',{
            title: title,
            content: content
          })
          .then(
            this.setState({
              title: "",
              content: ""
            })
          )
          .catch(error => console.err(error));


        case 'put':
          return axios.put(`http://127.0.0.1:8000/api/${articleID}/`,{
            title: title,
            content: content
          })
          .then(res => console.log(res))
          .catch(error => console.err(error));

        default:
          return null;
      }
    }

    render(){
      return (
        <div>
          <Form onSubmit={(event) => this.handleFormSubmit(
              event,
              this.props.requestType,
              this.props.articleID)}>
            <Form.Field>
              <label>Title</label>
              <input name="title" placeholder='Title here' />
            </Form.Field>
            <Form.Field>
              <label>Content</label>
              <input name="content" placeholder='Enter some Content...' />
            </Form.Field>
            <Button type='submit'>{this.props.btnText}</Button>
          </Form>
        </div>
      );
    }
}

const mapStateToProps = state => {
  return {
    token: state.token
  }
}

export default connect(mapStateToProps)(CustomForm);
