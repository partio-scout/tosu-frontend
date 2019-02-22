import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import './stylesheets/index.css'
import App from './App'
import store from './store'
import { savePofData } from './services/localStorage'
import { POF_ROOT } from './api-config'

const getPofData = async () => {
  const pofData = await axios.get(`${POF_ROOT}/filledpof/tarppo`)
  await store.subscribe(() => {
    savePofData(pofData)
  })
}

axios.defaults.withCredentials = true

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}

getPofData()
render()
store.subscribe(render)
