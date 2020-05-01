import React from 'react';
import { authAxios } from '../utils';
import {Link, withRouter} from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Dimmer,
  Divider,
  Form,
  Grid,
  Header,
  Image,
  Item,
  Loader,
  Message,
  Segment,
  Select,
  Table } from 'semantic-ui-react';
import { orderSummaryURL, addCouponURL, addressListURL, checkoutURL } from '../constants';

class OrderPreview extends React.Component {
  state = {
    data: null,
    loading: false,
    error: null
  }

  componentDidMount(){
    this.handleFetchOrder();
  }

  handleFetchOrder = () => {
    this.setState({loading: true})
    authAxios.get(orderSummaryURL)
    .then(res => {
      this.setState({data: res.data, loading: false});
    })
    .catch(err => {
      // if (err.response.status === 404){
        this.setState({error: "There are no Items in your cart", loading: false})
      // }else{
      //   this.setState({error: err, loading: false});
      // }
    });
  }

  renderVariations = order_item => {
    let text = '';
    order_item.item_variations.forEach(iv => {
      text += ` - ${iv.variation.name} : ${iv.value}`
    });
    return text;
  }

  render(){
    const {data} = this.state;
    return(
      <React.Fragment>
      <Header as='h3'>Finalize Order</Header>
      {data &&
          <React.Fragment>
          <Table basic='very' unstackable>
            <Table.Body>
            {data.order_items.map((order_item, i) =>{
              return(
                <Table.Row key={order_item.id}>
                  <Table.Cell collapsing>
                    <Image size='tiny' src={`http://127.0.0.1:8000${order_item.item.image}`}/>
                  </Table.Cell>
                  <Table.Cell verticalAlign='middle'>{order_item.item.title} {this.renderVariations(order_item)}</Table.Cell>
                  <Table.Cell singleLine verticalAlign='middle'>{order_item.quantity} x R {order_item.item.price}</Table.Cell>
                  <Table.Cell singleLine verticalAlign='middle'>R {order_item.final_price}</Table.Cell>
                </Table.Row>
              )
            })}
            {data.coupon &&
              <Table.Row positive>
                <Table.Cell />
                <Table.Cell>
                  Coupon "{data.coupon.code}" applied
                </Table.Cell>
                <Table.Cell />
                <Table.Cell>
                  - R {data.coupon.amount}
                </Table.Cell>
              </Table.Row>
            }
            </Table.Body>
          </Table>

          <Divider />
          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header className='float-right'>Order Total: R {data.total}</Item.Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

class CouponForm extends React.Component {
  state = {
    code: ''
  }

  handleChange = e => {
    this.setState({
      code: e.target.value
    })
  }

  handleSubmit = (e) => {
    const { code } = this.state;
    this.props.handleAddCoupon(e, code);
    this.setState({code: ""});
  }

  render(){
    const { code } = this.state
    return(
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Coupon Code</label>
            <input
              placeholder="Enter coupon code.."
              value={code}
              onChange={this.handleChange} />
          </Form.Field>
          <Button type='submit'>Submit</Button>
        </Form>
      </React.Fragment>
    );
  }
}

class Checkout extends React.Component {
  state = {
    data: null,
    loading: false,
    saving: false,
    success: false,
    error: null,
    billingAddresses: [],
    shippingAddresses: [],
    selectedBillingAddress: '',
    selectedShippingAddress: ''
  }

  componentDidMount(){
    this.handleFetchOrder();
    this.handleFetchBillingAddresses();
    this.handleFetchShippingAddresses();
  }

  handleGetDefaultAddress = addresses => {
    const filteredAddresses = addresses.filter(el => el.default === true);
    if (filteredAddresses.length > 0){
      return filteredAddresses[0].id;
    }
    return ''
  }

  handleFetchBillingAddresses = () => {
    this.setState({loading: true})
    authAxios.get(addressListURL('B'))
    .then(res => {
      this.setState({billingAddresses: res.data.map(a => {
        return{
          key: a.id,
          text: `${a.street_address}, ${a.street_address_2}, ${a.city.name}`,
          value: a.id
        };
      }),
      selectedBillingAddress: this.handleGetDefaultAddress(res.data),
      loading: false});
    })
    .catch(err => {
        this.setState({error: err, loading: false})
    });
  }

  handleFetchShippingAddresses = () => {
    this.setState({loading: true})
    authAxios.get(addressListURL('S'))
    .then(res => {
      this.setState({shippingAddresses: res.data.map(a => {
        return{
          key: a.id,
          text: `${a.street_address}, ${a.street_address_2}, ${a.city.name}`,
          value: a.id
        };
      }),
      selectedShippingAddress: this.handleGetDefaultAddress(res.data),
      loading: false});
    })
    .catch(err => {
        this.setState({error: err, loading: false})
    });
  }

  handleFetchOrder = () => {
    this.setState({loading: true})
    authAxios.get(orderSummaryURL)
    .then(res => {
      this.setState({data: res.data, loading: false});
    })
    .catch(err => {
      if (err.response.status === 404){
        this.props.history.push('/products')
      }else{
        this.setState({error: err, loading: false});
      }
    });
  }

  handleSelectChange = (e, {name, value}) => {
    this.setState({ [name] : value });
  };

  handleAddCoupon = (e, code) => {
    e.preventDefault();
    this.setState({ loading: true });
    authAxios.post(addCouponURL, {code})
    .then(res => {
      this.setState({
        loading: false
      })
      this.handleFetchOrder();
    })
    .catch(err =>{
      this.setState({ error: err, loading: false})
    })
  }

  submit = ev => {
    ev.preventDefault();
    this.setState({ loading: true, saving: true, error: null });
    const {
      selectedBillingAddress,
      selectedShippingAddress
    } = this.state;
    authAxios
      .post(checkoutURL, {
        selectedBillingAddress,
        selectedShippingAddress
      })
      .then(res => {
        this.setState({ loading: false, saving: true, success: true });
      })
      .catch(err => {
        this.setState({ loading: false, saving: false, error: err });
      });
  };

  render(){
    const {
      error,
      loading,
      billingAddresses,
      shippingAddresses,
      selectedBillingAddress,
      selectedShippingAddress,
      saving,
      success
      } = this.state
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
        <Grid stackable>
          <Grid.Row>
          <Grid.Column width={12}>
            <OrderPreview/>
          </Grid.Column>
          <Grid.Column width={4}>
            <Card>
              <Card.Content>
                <CouponForm handleAddCoupon={(e, code) => this.handleAddCoupon(e, code)}/>
              </Card.Content>
            </Card>
          </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Header>Select a billing address</Header>
        {billingAddresses.length > 0 ? (
          <Select
            name='selectedBillingAddress'
            value={selectedBillingAddress}
            clearable
            options={billingAddresses}
            selection
            onChange={this.handleSelectChange}/>
        ) : (
          <p>You need to <Link to='/profile'>add a billing address</Link></p>
        )}
        <Divider />
        <Header>Select a shipping address</Header>
        {shippingAddresses.length > 0 ? (
        <Select
          name='selectedShippingAddress'
          value={selectedShippingAddress}
          clearable
          options={shippingAddresses}
          selection
          onChange={this.handleSelectChange}/>
        ) : (
          <p>You need to <Link to='/profile'>add a shipping address</Link></p>
        )}
        <Divider />
        {billingAddresses.length < 1 || shippingAddresses.length < 1 ? (
          <p>You need to add all your address information before completing your purchase</p>
        ) : (
          <React.Fragment>
          {success && (
            <Message positive>
              <Message.Header>You payment was successful</Message.Header>
              <p>
                Go to your Profile to see your order status.
              </p>
            </Message>
          )}
            <Button disabled={saving} loading={saving} color='violet' onClick={this.submit}>Complete Payment</Button>
          </React.Fragment>
          )
        }
      </Container>
    );
  }
}

export default withRouter(Checkout);
