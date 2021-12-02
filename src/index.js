import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import configureStore from './store/configureStore';
import CustomThemeProvider from './themes/CustomThemeProvider';
import 'typeface-inter';

const store = configureStore();


ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <CustomThemeProvider>
                  <App />
          </CustomThemeProvider>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
