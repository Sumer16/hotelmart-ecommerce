// This package allows us to select & save option for dark or light mode
import Cookies from 'js-cookie';

import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  // Read dark mode from cookies
  darkMode: Cookies.get('darkmode') === 'ON' ? true : false,
  cart: {
    cartItems: Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [],
  },
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
    }
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