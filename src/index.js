import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import './stylesheets/index.css'
import App from './App'
import store from './store'

// const getPofData = async () => {
//   const pofData = await pofService.getAllTree()
//   await store.subscribe(() => {
//     savePofData(pofData)
//   })
// }

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
