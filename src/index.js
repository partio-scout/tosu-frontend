import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import './index.css'

import'./stylesheets/activity.css'
import'./stylesheets/button.css'
import'./stylesheets/calendar.css'
import'./stylesheets/chip.css'
import'./stylesheets/container.css'
import'./stylesheets/content.css'
import'./stylesheets/drawer.css'
import'./stylesheets/eventcard.css'
import'./stylesheets/footer.css'
import'./stylesheets/form.css'
import'./stylesheets/icons.css'
import'./stylesheets/login.css'
import'./stylesheets/mobile.css'
import'./stylesheets/search.css'
import'./stylesheets/statusbox.css'
import'./stylesheets/tooltip.css'
import'./stylesheets/utility.css'




import App from './App'
import store from './store'
import pofService from './services/pof'
import { savePofData } from './services/localStorage'

const getPofData = async () => {
  const pofData = await pofService.getAllTree()
  await store.subscribe(() => {
    savePofData(pofData)
})
}

axios.defaults.withCredentials = true

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App store={store} />
    </Provider>,
    document.getElementById('root')
  )
}

getPofData()
render()
store.subscribe(render)
