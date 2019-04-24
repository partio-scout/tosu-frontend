import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import App from './App'
import store from './store'
import { SnackbarProvider } from 'notistack'

axios.defaults.withCredentials = true

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </Provider>,
  document.getElementById('root')
)
