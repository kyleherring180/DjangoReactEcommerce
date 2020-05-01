import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Dimmer,
  Divider,
  Form,
  Grid,
  Header,
  Label,
  Loader,
  Menu,
  Message,
  Segment,
  Select,
  Table
} from 'semantic-ui-react'
import { addressListURL, addressCreateURL,
  cityListURL, userIDURL,
  addressUpdateURL, addressDeleteURL,
  orderHistoryURL} from '../constants';
import { authAxios } from '../utils';

const UPDATE_FORM = 'UPDATE_FORM';
const CREATE_FORM = 'CREATE_FORM';

class PaymentHistory extends React.Component{

  state = {
    orders: [],
    loading: false,
    error: ''
  }

  componentDidMount(){
    this.handleFetchPayments();
  }

  handleFetchPayments = () => {
    this.setState({loading: true})
    authAxios.get(orderHistoryURL)
    .then(res => {
      this.setState({
        loading: false,
        orders: res.data
      });
    })
    .catch(err => {
      this.setState({error: err, loading: false});
    });
  }

  render(){
    const {orders} = this.state;
    console.log(orders)
    return(
      <Table celled unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
        {orders.map(or => {
          return (
            <Table.Row key={or.id}>
              <Table.Cell>{or.id}</Table.Cell>
              <Table.Cell>
              {or.order_items.map(oi => {
                return(
                  <Table.Row key={oi.id}>
                    {oi.item.title} {oi.item_variations && (
                      oi.item_variations.map(iv => {
                        return(
                          <React.Fragment key={iv.id}>
                          - {iv.value} x {oi.quantity}
                          </React.Fragment>
                        )
                      })
                    )}

                  </Table.Row>
                )
              })}
              </Table.Cell>
              <Table.Cell>
                {or.being_delivered && ('being delivered')}
                {or.received && ('received')}
                {or.refund_requested && ('refund requested')}
                {or.refund_granted && ('refund granted')}
                {!or.being_delivered && !or.received && !or.refund_requested && !or.refund_granted ?
                  'ordered' : null
                }
              </Table.Cell>
              <Table.Cell singleLine>R {or.total}</Table.Cell>
            </Table.Row>
          )
        })}
        </Table.Body>
      </Table>
    )
  }
}

class AddressForm extends React.Component {
  state= {
    error: null,
    loading: false,
    countries: [],
    regions: [],
    cities: [],
    formData: {
                street_address: '',
                street_address_2: '',
                city: '',
                zip: '',
                address_type:'',
                default: false
              },
    saving: false,
    success: false
  }

  componentDidMount(){
    const {address, formType} = this.props;
    if(formType===UPDATE_FORM){
      this.setState({
        formData: {
            id: address.id,
            street_address: address.street_address,
            street_address_2: address.street_address_2,
            city: address.city.id,
            zip: address.zip,
            default: address.default
        }
      })
    };
    this.handleFetchCities();
  }

  pullCountries = city_country => {
    const cities = Object.values(city_country);
    // console.log(cities)
    let countries_id = [...new Set(cities.map(country => country.country.id))]
    let countries_name = [...new Set(cities.map(country => country.country.name))]

    var countries = countries_id.map(function(v, i){
      return {
        id: v,
        name: countries_name[i]
      }
    })
    return countries.map(k => {
     return {
       key: k.id,
       text: k.name,
       value: k.name
     };
   });
  }

  pullRegions = city_region => {
    const cities = Object.values(city_region);
    // console.log(cities)
    let region_id = [...new Set(cities.map(region => region.region.id))]
    let region_name = [...new Set(cities.map(region => region.region.name))]

    var regions = region_id.map(function(v, i){
      return {
        id: v,
        name: region_name[i]
      }
    })
    return regions.map(k => {
     return {
       key: k.id,
       text: k.name,
       value: k.name
     };
   });
  }

  handleFormatCities = cities => {
    const city_keys = Object.values(cities);
    return city_keys.map(ck => {
     return {
       key: ck.id,
       text: ck.name,
       value: ck.id,
       region: ck.region
     };
   });
  };

  handleFetchCities = () => {
    authAxios.get(cityListURL)
    .then(res => {
      this.setState({
        cities: this.handleFormatCities(res.data),
        regions: this.pullRegions(res.data),
        countries: this.pullCountries(res.data)
      });
    })
    .catch(err => {
      this.setState({ error: err });
    });
  };

  handleToggleDefault = () => {
    const {formData} = this.state;
    const updatedFormData = {
      ...formData,
      default: !formData.default
    };
    this.setState({
      formData: updatedFormData
    })
  }

  handleChange = e => {
    const {formData} = this.state;
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    this.setState({
      formData: updatedFormData
    });
  }

  handleSelectChange = (e, { name, value }) => {
    const {formData} = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    this.setState({
      formData: updatedFormData
    })
    this.handleFetchCities();
  }

  handleRegionSelectChange = (e, { name, value }) => {
    const {formData} = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    const{cities} = this.state;
    const region = updatedFormData.region;
    const city = cities.filter(city => city.region.name === region)
    this.setState({
      cities: city
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ saving: true })
    const {formType} = this.props;
    if(formType===UPDATE_FORM){
      this.handleUpdateAddress();
    }else{
      this.handleCreateAddress();
    }
  };

  handleCreateAddress = () => {
    const {activeItem, userID} = this.props;
    const { formData } = this.state;
    authAxios.post(addressCreateURL, {
      ...formData,
      user: userID,
      address_type: activeItem === "billingAddress" ? "B" : "S"
    })
    .then(res => {
      this.setState({
        saving: false,
        success: true,
        formData: { default: false }
      });
      this.props.callback();
    })
    .catch(err => {
      this.setState({ error: err });
    })
  };

  handleUpdateAddress = () => {
    const {activeItem, userID} = this.props;
    const { formData } = this.state;
    authAxios.put(addressUpdateURL(formData.id), {
      ...formData,
      user: userID,
      address_type: activeItem === "billingAddress" ? "B" : "S"
    })
    .then(res => {
      this.setState({
        saving: false,
        success: true,
        formData: { default: false }
      })
      this.props.callback();
    })
    .catch(err => {
      this.setState({ error: err });
    })
  };

  render(){
    const {countries, formData, regions, cities, saving, success} = this.state;
    return(
      <Form onSubmit={this.handleSubmit} success={success}>
        <Form.Input
          required
          name='street_address'
          placeholder='Street Address'
          onChange={this.handleChange}
          value={formData.street_address} />
        <Form.Input
          name='street_address_2'
          placeholder='Street Address line 2 (optional)'
          onChange={this.handleChange}
          value={formData.street_address_2}/>
        <Form.Field required>
          <Select
            clearable
            searchable
            fluid
            options={countries}
            name='country'
            placeholder='Country'
            onChange={this.handleCountrySelectChange}
            value={formData.country}/>
        </Form.Field>
        <Form.Field required>
          <Select
            clearable
            searchable
            fluid
            options={regions}
            name='region'
            placeholder='Region'
            onChange={this.handleRegionSelectChange}
            value={formData.region}/>
        </Form.Field>
        <Form.Field required>
          <Select
            clearable
            searchable
            fluid
            options={cities}
            name='city'
            placeholder='City'
            onChange={this.handleSelectChange}
            value={formData.city}/>
        </Form.Field>

        <Form.Input
          required
          name='zip'
          placeholder='Postal code'
          onChange={this.handleChange}
          value={formData.zip}/>
        <Form.Checkbox
          name='default'
          label='Make this the default address'
          onChange={this.handleToggleDefault}
          checked={formData.default}/>
        {success && (
          <Message
             success
             header='Success!'
             content='Your address was saved'
           />
        )}
        <Form.Button disabled={saving} loading={saving} color='violet'>Save</Form.Button>
      </Form>
    )
  }
}

class Profile extends React.Component {
  state = {
    activeItem: 'billingAddress',
    error: null,
    loading: false,
    addresses: [],
    userID: null,
    selectedAddress: null
  };

  componentDidMount(){
    this.handleFetchAddresses();
    this.handleFetchUserID();
  }

  handleItemClick = name => {
      this.setState({ activeItem: name }, () => {
        this.handleFetchAddresses();
      });
  }

  handleGetActiveitem = () => {
    const {activeItem} = this.state;
    if(activeItem === 'billingAddress'){
      return 'Billing Address';
    }else if (activeItem === 'shippingAddress'){
      return 'Shipping Address';
    }
    return 'Payment History';
  }

  handleDeleteAddress = addressID => {
    authAxios.delete(addressDeleteURL(addressID))
    .then(res => {
      this.handleCallback();
    })
    .catch(err => {
      this.setState({ error: err });
    });
  }

  handleSelectAddress = address => {
    this.setState({
      selectedAddress: address
    })
  }

  handleFetchUserID = () => {
    authAxios.get(userIDURL)
    .then(res => {
      this.setState({
        userID: res.data.userID
      });
    })
    .catch(err => {
      this.setState({ error: err });
    });
  };

  handleFetchAddresses = () => {
    this.setState({ loading: true });
    const {activeItem} = this.state;
    authAxios.get(addressListURL(activeItem === 'billingAddress' ? 'B' : 'S'))
    .then(res => {
      this.setState({ addresses: res.data, loading: false });
    })
    .catch(err => {
      this.setState({ error: err });
    });
  };

  handleCallback = () => {
    this.handleFetchAddresses();
    this.setState({
      selectedAddress: null
    })
  }

  renderAddresses = () => {
    const { activeItem, addresses, userID, selectedAddress } = this.state;
    return(
      <React.Fragment>
        <Card.Group>
           {addresses.map(a => {
             return (
               <Card key={a.id}>
                 <Card.Content>
                   {a.default && (
                     <Label as="a" color="blue" ribbon="right">
                       Default
                     </Label>
                   )}
                   <Card.Header>
                     {a.street_address}, {a.street_address_2}
                   </Card.Header>
                   <Card.Meta>{a.city.name}</Card.Meta>
                   <Card.Description>{a.zip}</Card.Description>
                 </Card.Content>
                 <Card.Content extra>
                    <Button basic color='green' onClick={() => this.handleSelectAddress(a)}>
                      Update
                    </Button>
                    <Button basic color='red' onClick={() => this.handleDeleteAddress(a.id)}>
                      Delete
                    </Button>
                </Card.Content>
               </Card>
             );
           })}
        </Card.Group>
        {addresses.length > 0 ? <Divider /> : null}
        {selectedAddress === null ? (
          <AddressForm
            activeItem={activeItem}
            userID={userID}
            formType={CREATE_FORM}
            callback={this.handleCallback}
          />
        ) : null}
        {selectedAddress && (
          <AddressForm
            activeItem={activeItem}
            userID={userID}
            address={selectedAddress}
            formType={UPDATE_FORM}
            callback={this.handleCallback}
          />
        )}
    </React.Fragment>
    )
  }

  render(){
    const { activeItem, error, loading } = this.state;
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
        <Grid stackable container divided>
          <Grid.Row>
            <Grid.Column width={4}>
              <Container>
              <Menu pointing vertical>
                <Menu.Item
                  name='Billing Address'
                  active={activeItem === 'billingAddress'}
                  onClick={() => this.handleItemClick('billingAddress')}
                />
                <Menu.Item
                  name='Shipping Address'
                  active={activeItem === 'shippingAddress'}
                  onClick={() => this.handleItemClick('shippingAddress')}
                />
                <Menu.Item
                  name='Order History'
                  active={activeItem === 'orderHistory'}
                  onClick={() => this.handleItemClick('orderHistory')}
                />
              </Menu>
              </Container>
            </Grid.Column>
            <Grid.Column width={12}>
              <Container>
              <Header>{this.handleGetActiveitem()}</Header>
              <Divider />
                {activeItem === 'orderHistory' ? (
                  <PaymentHistory />
                ) : (
                this.renderAddresses()
              )}
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return{
    isAuthenticated: state.auth.token !== null
  }
}

export default connect(mapStateToProps)(Profile);
