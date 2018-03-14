import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

console.log('Store', store.getState())

export default store
