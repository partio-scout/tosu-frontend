// Vendor
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import isTouchDevice from 'is-touch-device'
import React, { Component } from 'react'
import { LinearProgress, CssBaseline } from '@material-ui/core'
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
import Calendar from './components/Calendar'
import ButtonRow from './components/ButtonRow'
import Login from './components/Login'
import EventList from './components/EventList'
import TosuDrawer from './components/TosuDrawer'
import ToolbarSpacer from './components/ToolbarSpacer'

// Utils
import PropTypesSchema from './utils/PropTypesSchema'
import { createStatusMessage } from './utils/createStatusMessage'

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
import { eventsInitialization } from './reducers/eventReducer'
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
/**
 * The Application core
 *
 */
class App extends Component {
  state = {
    headerVisible: false,
    drawerVisible: true,
    bufferZoneHeight: 0,
    newEventVisible: false,
    startDate: moment(),
  }

  componentDidMount = async () => {
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
  /**
   * Init the application state from backend and pofRoot
   */
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

    const calendar = (
      <Calendar events={this.props.events} mobile={isTouchDevice()} />
    )
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <TosuDrawer initialization={this.initialization} />
        <div style={{ display: 'flex' }}>
          <AppBar />
          {isTouchDevice() ? null : <ActivitiesSidebar />}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexFlow: 'column',
              height: '100vh',
            }}
          >
            <ToolbarSpacer />
            <div style={{ padding: theme.spacing.unit * 2 }}>
              <ButtonRow
                view={view}
                newEvent={this.newEvent}
                dateRangeUpdate={this.dateRangeUpdate}
                mobile={isTouchDevice()}
              />
              {this.props.loading ? (
                <LinearProgress style={{ marginTop: theme.spacing.unit }} />
              ) : null}
            </div>
            <div
              style={{
                paddingLeft: theme.spacing.unit * 2,
                paddingRight: theme.spacing.unit * 2,
                flexGrow: 1,
                overflowY: 'auto',
              }}
            >
              {view === 'CALENDAR' ? (
                calendar
              ) : (
                <EventList
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                />
              )}
              <NewEvent
                open={this.state.newEventVisible}
                closeMe={this.handleClose}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

App.propTypes = {
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
