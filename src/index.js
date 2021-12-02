import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from "./App";
import './index.min.css';
import store from './store';
import {Provider} from 'react-redux';

ReactDOM.render(
        <Provider store={store}>
                <BrowserRouter>
                        <App/>
                </BrowserRouter>
        </Provider>
    , document.getElementById('root'));