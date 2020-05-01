import { combineReducers } from 'redux';
import authReducer from './auth';
import cartReducer from './cart';

export default combineReducers({
  auth: authReducer,
  cart: cartReducer
});
