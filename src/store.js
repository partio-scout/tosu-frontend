import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import notificationReducer from './reducers/notificationReducer'
import pofTreeReducer from './reducers/pofTreeReducer'
import BufferReducer from './reducers/bufferZoneReducer'
import EventsReducer from './reducers/eventReducer'
import PlanReducer from './reducers/planReducer'
import StatusMessageReducer from './reducers/statusMessageReducer'
import TaskgroupReducer from './reducers/taskgroupReducer'
import ScoutReducer from './reducers/scoutReducer'
import filterReducer from './reducers/filterReducer'
import calendarReducer from './reducers/calendarReducer'
import viewReducer from './reducers/viewReducer'
import loadingReducer from './reducers/loadingReducer'

const reducer = combineReducers({
  notification: notificationReducer,
  pofTree: pofTreeReducer,
  buffer: BufferReducer,
  events: EventsReducer,
  plans: PlanReducer,
  statusMessage: StatusMessageReducer,
  taskgroup: TaskgroupReducer,
  scout: ScoutReducer,
  filter: filterReducer,
  calendar: calendarReducer,
  view: viewReducer,
  loading: loadingReducer,
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store
