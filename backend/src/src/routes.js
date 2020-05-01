import React from 'react';
import { Route } from 'react-router-dom';
import ArticleList from './containers/ArticleListView';
import ArticleDetail from './containers/ArticleDetailView';
import Login from './containers/Login';
import Signup from './containers/Signup';
import ProductList from './containers/ProductList';
import ProductDetail from './containers/ProductDetail';
import OrderSummary from './containers/OrderSummary';
import Checkout from './containers/Checkout';
import Profile from  './containers/Profile';



const BaseRouter = () => (
    <div>
      <Route exact path='/' component={ArticleList} />
      <Route path='/login/' component={Login} />
      <Route path='/signup/' component={Signup} />
      <Route exact path='/products/' component={ProductList} />
      <Route path ='/products/:productID' component={ProductDetail} />
      <Route path='/order-summary/' component={OrderSummary} />
      <Route path='/checkout/' component={Checkout} />
      <Route path='/profile/' component={Profile} />
      <Route path='/articles/:articleID/' component={ArticleDetail} />
    </div>
);

export default BaseRouter;
