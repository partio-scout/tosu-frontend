import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import notificationReducer from './reducers/notificationReducer'
import pofActivityReducer from './reducers/pofActivityReducer'
import pofTreeReducer from './reducers/pofTreeReducer'
import BufferReducer from './reducers/bufferZoneReducer'
import EventsReducer from './reducers/eventReducer'
import PlanReducer from './reducers/planReducer'

const reducer = combineReducers({
  notification: notificationReducer,
  pofActivities: pofActivityReducer,
  pofTree: pofTreeReducer,
  buffer: BufferReducer,
  events: EventsReducer,
  plans: PlanReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store
