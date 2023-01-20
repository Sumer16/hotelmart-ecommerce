// This package allows us to select & save option for dark or light mode
import Cookies from 'js-cookie';

import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
    // Read dark mode from cookies
    darkMode: Cookies.get('darkmode') === 'ON' ? true : false,
};

function reducer(state, action) {
    switch(action.type) {
        case 'DARK_MODE_ON':
            return { ...state, darkMode: true };
        case 'DARK_MODE_OFF':
            return { ...state, darkMode: false };
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