import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { createStore , applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import productsReducer from './store/reducers/products';
import navReducer from './store/reducers/nav';
import authReducer from './store/reducers/auth';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; 

const rootReducer = combineReducers({
    products: productsReducer,
    nav: navReducer,
    auth: authReducer
})

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
)
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
    
, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
