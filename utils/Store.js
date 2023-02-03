// This package allows us to select & save option for dark or light mode
import { createContext, useReducer } from 'react';

import Cookies from 'js-cookie';

export const Store = createContext();

const initialState = {
  // Read dark mode from cookies
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    cartItems: Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [],
    paymentMethod: Cookies.get('paymentMethod') ? Cookies.get('paymentMethod') : '',
  },
  userInfo: Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((item) => item._key === newItem._key);
      const cartItems = existItem ? state.cart.cartItems.map((item) => item._key === existItem._key ? newItem : item) : [...state.cart.cartItems, newItem];
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    };
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter((item) => item._key !== action.payload._key);
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    };
    case 'CART_CLEAR': 
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload };
    case 'USER_LOGOUT':
      return { ...state, userInfo: null, cart: { cartItems: [] } };
    case 'SAVE_PAYMENT_METHOD':
      return { ...state, cart: { ...state.cart, paymentMethod: action.payload } };
    default:
      return state;
  }
}

// HOC to wrapper the application around it
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>
}
