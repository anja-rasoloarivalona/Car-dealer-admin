import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { createStore , applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import productsReducer from './store/reducers/products';
import navReducer from './store/reducers/nav';
import authReducer from './store/reducers/auth';
import suppliersReducer from './store/reducers/suppliers';
import errorReducer from './store/reducers/error';
import publicityReducer from './store/reducers/publicity';
import parametersReducer from './store/reducers/parameters';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; 

const rootReducer = combineReducers({
    products: productsReducer,
    nav: navReducer,
    auth: authReducer,
    suppliers: suppliersReducer,
    error: errorReducer,
    publicity: publicityReducer,
    parameters: parametersReducer
})

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
)
ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>
    
, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
