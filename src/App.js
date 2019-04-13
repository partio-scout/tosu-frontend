// Vendor
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import isTouchDevice from 'is-touch-device'
import React, { Component } from 'react'
import {
  Dialog,
  DialogTitle,
  LinearProgress,
  CssBaseline,
} from '@material-ui/core'
import moment from 'moment'
import 'react-dates/initialize'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { normalize } from 'normalizr'
// CSS
import './stylesheets/index.css'
import 'react-dates/lib/css/_datepicker.css'
import './stylesheets/react_dates_overrides.css'
import 'rc-tree-select/assets/index.css'
import 'react-big-calendar-like-google/lib/css/react-big-calendar.css'
import 'react-select/dist/react-select.css'
import theme from './theme'

// Components
import NewEvent from './components/NewEvent'
import AppBar from './components/AppBar'
import ActivitiesSidebar from './components/ActivitiesSidebar'
import Notification from './components/Notification'
import EventCard from './components/EventCard'
import KuksaEventCard from './components/KuksaEventCard'
import Calendar from './components/Calendar'
import ButtonRow from './components/ButtonRow'
import Login from './components/Login'
import DeleteTosuButton from './components/DeleteTosuButton'
// Utils
import PropTypesSchema from './utils/PropTypesSchema'
import { createStatusMessage } from './utils/createStatusMessage'
import filterEvents from './functions/filterEvents'

// Services
import {
  getGoogleToken,
  getScout,
  removeGoogleToken,
} from './services/googleToken'

// Reducers
import { pofTreeInitialization, pofTreeUpdate } from './reducers/pofTreeReducer'
import {
  bufferZoneInitialization,
  deleteActivityFromBuffer,
} from './reducers/bufferZoneReducer'
import { eventsInitialization, eventList } from './reducers/eventReducer'
import { activityInitialization } from './reducers/activityReducer'
import { addStatusInfo } from './reducers/statusMessageReducer'
import { scoutGoogleLogin, readScout } from './reducers/scoutReducer'
import { viewChange } from './reducers/uiReducer'
import { setLoading } from './reducers/loadingReducer'
import eventService from './services/events'
import activityService from './services/activities'
import {
  tosuInitialization,
  deleteTosu,
  selectTosu,
} from './reducers/tosuReducer'

import { POF_ROOT } from './api-config'
import { pofTreeSchema, eventSchema } from './pofTreeSchema'

class App extends Component {
  state = {
    headerVisible: false,
    drawerVisible: true,
    bufferZoneHeight: 0,
    newEventVisible: false,
    startDate: moment(),
  }

  componentDidMount = async () => {
    switch (window.location.pathname) {
      case '/new-event':
        this.setState({
          headerVisible: false,
          bufferZoneHeight: 0,
          newEventVisible: false,
        })
        break
      case '/calendar':
        this.props.viewChange('CALENDAR')
        break
      default:
        break
    }
    await this.checkLoggedIn()
    //let pofData = loadCachedPofData()
    if (this.props.scout !== null) {
      await this.initialization()
      this.props.pofTreeUpdate(this.props.activities)
    }

    // If touch device is used, empty bufferzone so activities that have been left to bufferzone can be added to events
    if (isTouchDevice()) {
      const bufferActivities = this.props.buffer.activities
      const promises = bufferActivities.map(activity =>
        this.props.deleteActivityFromBuffer(activity.id)
      )
      try {
        await Promise.all(promises)
      } catch (exception) {
        console.log('Error in emptying buffer', exception)
      }
    }

    // PartioID login (BROKEN)
    if (getScout() !== null) {
      this.props.readScout() // Reads scout from a cookie. (Has only name)
    }

    // Finish loading after everything above is done
    this.props.setLoading(false)
  }

  componentDidUpdate = () => {
    const status = createStatusMessage(
      this.props.events,
      this.props.pofTree,
      this.props.taskgroup,
      this.props.activities
    )
    this.props.addStatusInfo(status)
  }

  setHeaderHeight = height => {
    if (height !== this.state.bufferZoneHeight) {
      this.setState({ bufferZoneHeight: height })
    }
  }
  initialization = async () => {
    const pofRequest = await axios.get(`${POF_ROOT}/filledpof/tarppo`)
    const pofData = pofRequest.data
    const normalizedPof = normalize(pofData, pofTreeSchema)
    this.props.pofTreeInitialization(normalizedPof)
    const tosuID = await this.props.tosuInitialization()
    const buffer = await activityService.getBufferZoneActivities(
      this.props.scout.id
    )
    if (tosuID) {
      const eventDataRaw = await eventService.getAll(tosuID)
      const eventData = normalize(eventDataRaw, eventSchema).entities
      if (!eventData.activities) eventData.activities = {}
      if (!eventData.events) eventData.events = {}
      this.props.activityInitialization(
        Object.keys(eventData.activities).map(key => eventData.activities[key]),
        buffer.activities
      )
      this.props.eventsInitialization(eventData.events)
    } else {
      this.props.activityInitialization([], buffer.activities)
    }
    this.props.bufferZoneInitialization(buffer)
  }

  checkLoggedIn = async () => {
    // Google login
    if (getGoogleToken() !== null) {
      try {
        await this.props.scoutGoogleLogin(getGoogleToken())
      } catch (exception) {
        removeGoogleToken()
      }
    }
    // PartioID login
    if (getScout() !== null) {
      this.props.readScout() // Reads scout from a cookie. (Has only name)
    }
  }

  toggleDrawer = () => {
    this.setState(state => ({ drawerVisible: !state.drawerVisible }))
  }

  selectView = value => () => {
    this.props.viewChange(value)
  }

  newEvent = () => this.setState({ newEventVisible: true })
  handleClose = () => this.setState({ newEventVisible: false })

  dateRangeUpdate = ({ startDate, endDate }) => {
    this.setState({ startDate, endDate })
  }

  render() {
    const view = this.props.ui.view
    const { startDate, endDate } = this.setState

    let odd = true
    if (this.props.scout === null) {
      return (
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Login
            initialization={this.initialization}
            token="1059818174105-9p207ggii6rt2mld491mdbhqfvor2poc.apps.googleusercontent.com"
          />
        </MuiThemeProvider>
      )
    }

    const eventsToList = (
      <div id="event-list-container">
        {view === 'KUKSA'}
        <ul
          className={
            isTouchDevice() ? 'mobile-event-list event-list' : 'event-list'
          }
        >
          {filterEvents(
            view,
            eventList(this.props.events),
            startDate,
            endDate
          ).map(event => {
            odd = !odd
            return (
              <li className="event-list-item" key={event.id ? event.id : 0}>
                {event.kuksaEvent ? (
                  <KuksaEventCard event={event} />
                ) : (
                  <EventCard event={event} odd={odd} />
                )}
              </li>
            )
          })}
          <li>
            <DeleteTosuButton initialization={this.initialization} />
          </li>
        </ul>
      </div>
    )

    const calendar = (
      <Calendar events={this.props.events} mobile={isTouchDevice()} />
    )

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ display: 'flex' }}>
          <AppBar />
          <ActivitiesSidebar />
          <div style={{ width: '100%' }}>
            <div style={theme.mixins.toolbar} />
            <div style={{ padding: theme.spacing.unit * 2 }}>
              <ButtonRow
                view={view}
                newEvent={this.newEvent}
                dateRangeUpdate={this.dateRangeUpdate}
                mobile={isTouchDevice()}
              />
              {this.props.loading ? (
                <LinearProgress style={{ marginTop: 5 }} />
              ) : null}
              {view === 'CALENDAR' ? calendar : eventsToList}

              <Dialog
                open={this.state.newEventVisible}
                onClose={this.handleClose}
              >
                <DialogTitle>Luo uusi tapahtuma</DialogTitle>
                <NewEvent closeMe={this.handleClose} />
              </Dialog>
            </div>
          </div>
          <Notification />
        </div>
      </MuiThemeProvider>
    )
  }
}

App.propTypes = {
  notification: PropTypes.string.isRequired,
  buffer: PropTypesSchema.bufferShape.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  pofTree: PropTypesSchema.pofTreeShape.isRequired,
  taskgroup: PropTypesSchema.taskgroupShape.isRequired,
  scout: PropTypesSchema.scoutShape.isRequired,
  view: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  tosu: PropTypes.string.isRequired,
  pofTreeInitialization: PropTypes.func.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
  eventsInitialization: PropTypes.func.isRequired,
  activityInitialization: PropTypes.func.isRequired,
  bufferZoneInitialization: PropTypes.func.isRequired,
  tosuInitialization: PropTypes.func.isRequired,
  deleteActivityFromBuffer: PropTypes.func.isRequired,
  addStatusInfo: PropTypes.func.isRequired,
  scoutGoogleLogin: PropTypes.func.isRequired,
  readScout: PropTypes.func.isRequired,
  viewChange: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
}

App.defaultProps = {
  scout: PropTypes.shape({ id: '' }),
}

const mapStateToProps = state => ({
  notification: state.notification,
  buffer: state.buffer,
  events: state.events,
  pofTree: state.pofTree,
  taskgroup: state.taskgroup,
  scout: state.scout,
  loading: state.loading,
  activities: state.activities,
  tosu: state.tosu,
  ui: state.ui,
})

const mapDispatchToProps = {
  pofTreeInitialization,
  pofTreeUpdate,
  eventsInitialization,
  activityInitialization,
  bufferZoneInitialization,
  tosuInitialization,
  deleteActivityFromBuffer,
  addStatusInfo,
  scoutGoogleLogin,
  readScout,
  viewChange,
  setLoading,
  deleteTosu,
  selectTosu,
}

App.propTypes = {
  ...PropTypesSchema,
}

const AppDnD = DragDropContext(HTML5Backend)(App)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppDnD)
