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
import calendarReducer from './reducers/calendarReducer'
import viewReducer from './reducers/viewReducer'
import loadingReducer from './reducers/loadingReducer'
import activityReducer from './reducers/activityReducer'

import tosuReducer from './reducers/tosuReducer'

const reducer = combineReducers({
  notification: notificationReducer,
  pofTree: pofTreeReducer,
  buffer: BufferReducer,
  events: EventsReducer,
  activities: activityReducer,
  plans: PlanReducer,
  statusMessage: StatusMessageReducer,
  taskgroup: TaskgroupReducer,
  scout: ScoutReducer,
  calendar: calendarReducer,
  view: viewReducer,
  loading: loadingReducer,
  tosu: tosuReducer,
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store
