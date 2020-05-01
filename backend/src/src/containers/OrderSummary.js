import React from 'react';
import {connect} from 'react-redux';
import { authAxios } from '../utils';
import {Redirect} from 'react-router-dom';
import {
  Button,
  Container,
  Dimmer,
  Header,
  Icon,
  Label,
  Loader,
  Message,
  Segment,
  Table,
  } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import { orderSummaryURL, orderItemDeleteURL, addToCartURL, orderItemUpdateQuantityURL } from '../constants';
import { fetchCart } from "../store/actions/cart";

class OrderSummary extends React.Component {

  state = {
    data: null,
    error: null,
    loading: false
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
      if (err.response.status === 404){
        this.setState({error: "There are no Items in your cart", laoding: false})
      }else{
        this.setState({error: err, loading: false});
      }
    });
  }

  renderVariations = order_item => {
    let text = '';
    order_item.item_variations.forEach(iv => {
      text += ` - ${iv.variation.name} : ${iv.value}`
    });
    return text;
  }

  handleFormatData = itemVariations => {
    return Object.keys(itemVariations).map(key => {
      return itemVariations[key].id;
    })
  }

  handleAddToCart = (slug, itemVariations) => {
    this.setState({
      loading: true
    });
    const variations = this.handleFormatData(itemVariations);
    authAxios.post(addToCartURL, {slug, variations})
    .then(res => {
      this.handleFetchOrder();
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

  handleRemoveQuantityFromCart = slug => {
    authAxios.post(orderItemUpdateQuantityURL, {slug})
    .then(res => {
      this.handleFetchOrder();
      this.props.fetchCart();
    })
    .catch(err => {
      this.setState({error: err});
    })
  }

  handleRemoveItem = itemID => {
    authAxios.delete(orderItemDeleteURL(itemID))
    .then(res => {
      this.handleFetchOrder();
      this.props.fetchCart();
    })
    .catch(err => {
      this.setState({error: err});
    })
  }

  render(){
    const {data, error, loading} = this.state;
    const {isAuthenticated} = this.props;
    if(!isAuthenticated){
      return <Redirect to='/login/'/>
    }
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
        </Segment>
      )}
        <Header as='h3'>Order Summary</Header>
        {data &&
          <Table striped unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Item #</Table.HeaderCell>
                <Table.HeaderCell>Item Name</Table.HeaderCell>
                <Table.HeaderCell>Item Price</Table.HeaderCell>
                <Table.HeaderCell>Item Quantity</Table.HeaderCell>
                <Table.HeaderCell>Total Item Price</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data.order_items.map((order_item, i) =>{
                return(
                  <Table.Row key={order_item.id}>
                    <Table.Cell>{i+1}</Table.Cell>
                    <Table.Cell>{order_item.item.title} {this.renderVariations(order_item)}</Table.Cell>
                    <Table.Cell>R {order_item.item.price}</Table.Cell>
                    <Table.Cell singleLine textAlign='center'>
                      <Icon
                        name='minus'
                        color='violet'
                        style={{float: 'left', cursor: 'pointer'}}
                        className='ml-2'
                        bordered
                        inverted
                        size='tiny'
                        onClick={() => this.handleRemoveQuantityFromCart(order_item.item.slug)}
                      />
                      {order_item.quantity}
                      <Icon
                        name='plus'
                        color='violet'
                        style={{float: 'right', cursor: 'pointer'}}
                        bordered
                        inverted
                        size='tiny'
                        onClick={() => this.handleAddToCart(
                           order_item.item.slug,
                           order_item.item_variations
                         )}
                      />
                    </Table.Cell>
                    <Table.Cell singleLine textAlign='center'>
                      {order_item.item.discount_price && (
                        <Label ribbon>Discount</Label>
                      )}
                      R {order_item.final_price}
                      <Icon
                        name='trash'
                        color='violet'
                        style={{float: 'right', cursor: 'pointer'}}
                        onClick={() => this.handleRemoveItem(order_item.id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                )
              })}
              <Table.Row>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell colSpan='2' textAlign='center'>
                  Total: R {data.total}
                </Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='5' textAlign='right'>
                  <Link to="/checkout"><Button color='violet'>Checkout</Button></Link>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        }
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return{
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCart: () => dispatch(fetchCart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);
