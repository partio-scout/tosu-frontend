import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import './stylesheets/index.css'
import App from './App'
import store from './store'
import { savePofData } from './services/localStorage'
import { POF_ROOT } from './api-config'

axios.defaults.withCredentials = true

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}

render()
