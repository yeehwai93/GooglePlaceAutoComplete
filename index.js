import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './styles/mini-web/mini-web.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux';
import userReducer from './reducers/userReducer';
import thunk from 'redux-thunk';
import localforage from 'localforage';
import { persistCombineReducers, REHYDRATE, PERSIST } from 'redux-persist';
import { StorageConfig } from './configs';


const composeEnhancers = process.env.NODE_ENV === 'development' ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;

/** store initialization **/
localforage.config(StorageConfig);
let storeRehydrating = true;
const storageMiddleware = (store) => (next) => (action) => {
  if (action.type === REHYDRATE || action.type === PERSIST || storeRehydrating) {
    return next(action);
  }
  const stampedAction = {
    action,
    timeStamp: Date.now()
  };

  localStorage.setItem('LAST-ACTION', JSON.stringify(stampedAction));

  next(action);
};

const middleware = [thunk, storageMiddleware];
const reducer = persistCombineReducers({
  key: 'root',
  storage: localforage,
  debug: process.env.NODE_ENV === 'development'
}, {
    userStore: userReducer
  });
export const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(...middleware)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
