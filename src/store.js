import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import pofTreeReducer from './reducers/pofTreeReducer'
import BufferReducer from './reducers/bufferZoneReducer'
import EventsReducer from './reducers/eventReducer'
import PlanReducer from './reducers/planReducer'
import StatusMessageReducer from './reducers/statusMessageReducer'
import TaskgroupReducer from './reducers/taskgroupReducer'
import ScoutReducer from './reducers/scoutReducer'
import calendarReducer from './reducers/calendarReducer'
import loadingReducer from './reducers/loadingReducer'
import activityReducer from './reducers/activityReducer'

import tosuReducer from './reducers/tosuReducer'
import uiReducer from './reducers/uiReducer'

const reducer = combineReducers({
  pofTree: pofTreeReducer,
  buffer: BufferReducer,
  events: EventsReducer,
  activities: activityReducer,
  plans: PlanReducer,
  statusMessage: StatusMessageReducer,
  taskgroup: TaskgroupReducer,
  scout: ScoutReducer,
  calendar: calendarReducer,
  loading: loadingReducer,
  tosu: tosuReducer,
  ui: uiReducer,
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store
