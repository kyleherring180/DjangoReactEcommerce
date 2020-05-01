import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Container, Icon, Card, Divider } from 'semantic-ui-react'
import CustomForm from '../components/Form';


class ArticleDetail extends React.Component {

  state = {
    article: {}
  }

  componentDidUpdate(newProps){
    if (newProps.token){
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: newProps.token
      }
    }
  }

  componentDidMount(){
    const articleID = this.props.match.params.articleID;
    axios.get(`http://127.0.0.1:8000/api/${articleID}/`)
      .then(res =>{
        this.setState({
          article: res.data
        });
      })
  }

  handleDelete = event => {
    event.preventDefault();
    if (this.props.token !== null){
      const articleID = this.props.match.params.articleID;
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: this.props.token
      }
      axios.delete(`http://127.0.0.1:8000/api/${articleID}/`);
      this.props.history.push('/');
      this.forceUpdate();
    }else{
      //Display some error message
    }
  }

  render (){
    return (
      <div>
        <Container>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                {this.state.article.title}
              </Card.Header>
              <Divider />
              <Card.Description>
                {this.state.article.content}
              </Card.Description>
              <Card.Content extra textAlign='right'>
                <Icon color='green' name='check' /> 121 Votes
              </Card.Content>
            </Card.Content>
          </Card>
          <br />
          <CustomForm
            requestType="put"
            articleID={this.props.match.params.articleID}
            btnText="Update"/>
          <br />
          <form onSubmit={this.handleDelete}>
            <Button type='submit' color='red'>
              <Icon name='delete'/>
              Delete
            </Button>
          </form>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.token
  }
}

export default connect(mapStateToProps)(ArticleDetail);
