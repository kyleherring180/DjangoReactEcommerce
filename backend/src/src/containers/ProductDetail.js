import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button,
        Card,
        Divider,
        Grid,
        Form,
        Header,
        Icon,
        Image,
        Item,
        Label,
        Container,
        Segment,
        Select,
        Loader,
        Dimmer,
        Message } from 'semantic-ui-react';
import { productDetailURL, addToCartURL } from '../constants';
import { authAxios } from '../utils';
import { fetchCart } from "../store/actions/cart";


class ProductDetail extends React.Component {

  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    formData: {}
  }

  componentDidMount(){
    this.handleFetchItem();
  }

  handleToggleForm = () => {
    const { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible
    })
  }

  handleFetchItem = () => {
    const {match: {params}} = this.props;
    this.setState({
      loading: true
    });
    axios.get(productDetailURL(params.productID))
    .then(res => {
      console.log(res.data);
      this.setState({
        data: res.data,
        loading: false
      });
    })
    .catch(err => {
      this.setState({
        error: err
      });
    })
  }

  handleFormatData = formData => {
    return Object.keys(formData).map(key => {
      return formData[key];
    })
  }

  handleAddToCart = slug => {
    this.setState({
      loading: true
    });
    const {formData} = this.state;
    const variations = this.handleFormatData(formData);
    authAxios.post(addToCartURL, {slug, variations})
    .then(res => {
      this.props.fetchCart();
      this.setState({
        loading: false
      });
    })
    .catch(err => {
      this.setState({
        error: err
      });
    })
  }

  handleChange = (e, {name, value}) => {
    const {formData} = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    this.setState({
      formData: updatedFormData
    });
  };

  render (){
    const {data, error, formData, formVisible, loading} = this.state;
    const item = data;
    return(
      <Container>
      {error && (
        <Message negative
          header = "There were some errors with your request"
          content = {JSON.stringify(error)}
          />
      )}
      {loading && (
        <Segment>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>

          <Image src='/images/wireframe/short-paragraph.png' />
        </Segment>
      )}

      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <Card fluid>
              <Image src={item.image}/>
              <Card.Header as='h2'>
                <Container>
                {item.title}
                </Container>
                <Container textAlign='right'>
                { item.discount_price ? (
                  <React.Fragment>
                  <strike>R {item.price} </strike>
                  <Label>R {item.discount_price}</Label>
                  </React.Fragment>
                ) : (
                  <div>R {item.price}</div>
                )}
                </Container>
              </Card.Header>
              <Card.Content>
                {item.description}
              </Card.Content>
              <Button
                fluid
                color="violet"
                floated='right'
                icon
                labelPosition="right"
                onClick={this.handleToggleForm}>
                Add to Cart
                <Icon name='cart plus' />
              </Button>
            </Card>

            {formVisible && (
              <React.Fragment>
                <Divider />
                <Form>
                  {data.variations.map(v => {
                    const name  = v.name.toLowerCase();
                    return(
                      <Form.Field key={v.id}>
                      <Select
                        name={name}
                        onChange={this.handleChange}
                        options={v.item_variations.map(item => {
                          return{
                            key: item.id,
                            text: item.value,
                            value: item.id
                          }
                        })}
                        placeholder={`Choose a ${name}`}
                        fluid
                        selection
                        value={formData[name]}
                      />
                      </Form.Field>
                    )
                  })}
                  <Form.Button onClick={() => this.handleAddToCart(item.slug)}>
                    Submit
                  </Form.Button>
                </Form>
              </React.Fragment>
            )}

          </Grid.Column>
          <Grid.Column>
            {data.variations && (
              data.variations.map(v => {
                return(
                  <React.Fragment key={v.id}>
                    <Header as='h2'>Try different variations</Header>
                    <Header as='h3'>{v.name}</Header>
                    <Item.Group divided>
                      {v.item_variations.map(iv => {
                        return(
                            <Item key={iv.id}>
                            {iv.attachment && (
                              <Item.Image size='tiny' src={`http://127.0.0.1:8000${iv.attachment}`} />
                            )}
                              <Item.Content verticalAlign='middle'>{iv.value}</Item.Content>
                            </Item>
                        )
                      })}
                    </Item.Group>
                  </React.Fragment>
                )
              })
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      </Container>

    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCart: () => dispatch(fetchCart())
  }
}

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail));
