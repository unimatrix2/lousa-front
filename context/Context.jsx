import { useReducer, useContext, createContext } from 'react';
import { user } from './reducers/user';
import { offline } from './reducers/offline';
const initialState = {
  user: {},
	offline: false,
};

const Context = createContext({});

const combineReducers = (...reducers) => (state, action) => {
  for (let i = 0; i < reducers.length; i++) state = reducers[i](state, action);
  return state;
};

const Provider = ({children}) => {
  const [state, dispatch] = useReducer(combineReducers(user, offline), initialState);
  const value = { state, dispatch };
	return <Context.Provider value={value}>{children}</Context.Provider>;
}

export { Context, Provider };