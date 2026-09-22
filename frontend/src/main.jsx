import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css'
import './assets/css/styleAdmin.css'
import './assets/js/scriptAdmin.js'
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter as Router} from 'react-router-dom';
import {
  persistStore,
  } from 'redux-persist'
  import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux' ;
import store from './redux/store.js';
let persistor = persistStore(store)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
  </React.StrictMode>,
)
