import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
        Card,
        Container,
        Dimmer,
        Divider,
        Grid,
        Header,
        Image,
        Label,
        Loader,
        Menu,
        Message,
        Segment,
         } from 'semantic-ui-react';
import { productListURL, addToCartURL } from '../constants';
import { authAxios } from '../utils';
import { fetchCart } from "../store/actions/cart";

class ProductByCategory extends React.Component{

  handleItemCategory = (activeItem, items) => {
    if(activeItem === 'freshProduce'){
      return items.filter(item => item.category === 'Fresh Produce')
    } else if (activeItem === 'beansAndGrains'){
      return items.filter(item => item.category === 'Beans and Grains')
    } else if (activeItem === 'nutsAndSeeds'){
      return items.filter(item => item.category === 'Nuts and Seeds')
    }else if (activeItem === 'driedFruit'){
      return items.filter(item => item.category === 'Dried Fruit')
    }else if (activeItem === 'pantryItems'){
      return items.filter(item => item.category === 'Pantry Items')
    }else if (activeItem === 'baking'){
      return items.filter(item => item.category === 'Baking')
    }else if (activeItem === 'spicesAndHerbs'){
      return items.filter(item => item.category === 'Spices and Herbs')
    }else{
      return items.filter(item => item.category === 'Snacking')
    }
  }

  render(){
    const {activeItem, items, history} = this.props;
    console.log(items)
    const item = this.handleItemCategory(activeItem, items)
    return(
      <React.Fragment>
      {item.map(i => {
        return(
          <Card as='a' onClick={() => history.push(`/products/${i.id}`)} key={i.id}>
            <Image src={i.image} wrapped ui={false} />
            <Card.Content>
              <Card.Header>{i.title}</Card.Header>
              <Card.Meta>
                <span className='date'>{i.category}</span>
              </Card.Meta>
              <Card.Description>
                {i.description}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
            { i.discount_price ? (
              <React.Fragment>
              <strike>R {i.price}</strike>
              <Label>R {i.discount_price}</Label>
              </React.Fragment>
            ) : (
              <div>R {i.price}</div>
            )}
            </Card.Content>
          </Card>
        )
      })}

      </React.Fragment>

    )
  }
}

class ProductList extends React.Component {

  state = {
    activeItem: 'freshProduce',
    loading: false,
    error: null,
    data: []
  }

  componentDidMount(){
    this.setState({
      loading: true
    });
    axios.get(productListURL)
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

  handleItemClick = name => {
      this.setState({ activeItem: name }, () => {

      });
  }

  handleGetActiveitem = () => {
    const {activeItem} = this.state;
    if(activeItem === 'freshProduce'){
      return 'Fresh Produce';
    }else if (activeItem === 'beansAndGrains'){
      return 'Beans and Grains';
    }else if (activeItem === 'nutsAndSeeds'){
      return 'Nuts and Seeds';
    }else if (activeItem === 'driedFruit'){
      return 'Dried Fruit';
    }else if (activeItem === 'pantryItems'){
      return 'Pantry Items';
    }else if (activeItem === 'baking'){
      return 'Baking';
    }else if (activeItem === 'spicesAndHerbs'){
      return 'Spices and Herbs';
    } else {
      return 'Snacking';
    }

  }

  handleAddToCart = slug => {
    this.setState({
      loading: true
    });
    authAxios.post(addToCartURL, {slug: slug})
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

  render (){
    const {activeItem, data, error, loading} = this.state;
    const { history } = this.props;
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
          <Grid.Column width={4}>
          <Menu pointing vertical>
            <Menu.Item
              name='Fresh Produce'
              active={activeItem === 'freshProduce'}
              onClick={() => this.handleItemClick('freshProduce')}
            />
            <Menu.Item
              name='Beans and Grains'
              active={activeItem === 'beansAndGrains'}
              onClick={() => this.handleItemClick('beansAndGrains')}
            />
            <Menu.Item
              name='Nuts and seeds'
              active={activeItem === 'nutsAndSeeds'}
              onClick={() => this.handleItemClick('nutsAndSeeds')}
            />
            <Menu.Item
              name='Dried Fruit'
              active={activeItem === 'driedFruit'}
              onClick={() => this.handleItemClick('driedFruit')}
            />
            <Menu.Item
              name='Pantry Items'
              active={activeItem === 'pantryItems'}
              onClick={() => this.handleItemClick('pantryItems')}
            />
            <Menu.Item
              name='Baking'
              active={activeItem === 'baking'}
              onClick={() => this.handleItemClick('baking')}
            />
            <Menu.Item
              name='Herbs and Spices'
              active={activeItem === 'spicesAndHerbs'}
              onClick={() => this.handleItemClick('spicesAndHerbs')}
            />
            <Menu.Item
              name='Snacking'
              active={activeItem === 'snacking'}
              onClick={() => this.handleItemClick('snacking')}
            />
          </Menu>
          </Grid.Column>
          <Grid.Column width={12}>
          <Header>{this.handleGetActiveitem()}</Header>
          <Card.Group itemsPerRow={3} stackable>
              <React.Fragment>
                <ProductByCategory
                  items={data}
                  activeItem={activeItem}
                  history={history}
                />
              </React.Fragment>
          </Card.Group>
          <Divider />
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

export default connect(null, mapDispatchToProps)(ProductList);
