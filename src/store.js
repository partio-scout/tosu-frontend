import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import notificationReducer from './reducers/notificationReducer'
import pofActivityReducer from './reducers/pofActivityReducer'

const reducer = combineReducers({
  notification: notificationReducer,
  pofActivities: pofActivityReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store
