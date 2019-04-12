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
import PropTypesSchema from './components/PropTypesSchema'
// Utils
import { createStatusMessage } from './utils/createStatusMessage'
import filterEvents from './functions/filterEvents'

// Services
import { getGoogleToken, getScout } from './services/googleToken'

// Reducers
import { notify } from './reducers/notificationReducer'
import { pofTreeInitialization, pofTreeUpdate } from './reducers/pofTreeReducer'
import {
  bufferZoneInitialization,
  deleteActivityFromBuffer,
} from './reducers/bufferZoneReducer'
import { eventsInitialization } from './reducers/eventReducer'
import { addStatusInfo } from './reducers/statusMessageReducer'
import { scoutGoogleLogin, readScout } from './reducers/scoutReducer'
import { viewChange } from './reducers/uiReducer'
import { setLoading } from './reducers/loadingReducer'
import { tosuInitialization } from './reducers/tosuReducer'

import { POF_ROOT } from './api-config'

class App extends Component {
  state = {
    headerVisible: false,
    drawerVisible: true,
    bufferZoneHeight: 0,
    newEventVisible: false,
    startDate: moment(),
  }

  componentDidMount = async () => {
    try {
      // Load pofData and put it in Redux store
      const pofData = await axios.get(`${POF_ROOT}/filledpof/tarppo`)
      this.props.pofTreeInitialization(pofData)

      if (getGoogleToken() !== null) {
        // Create or load existing user based on the googleToken
        await this.props.scoutGoogleLogin(getGoogleToken())

        // then load user's Tosus
        const tosuId = await this.props.tosuInitialization()

        // load user's activities which are in buffer
        // load user's events based on selected Tosu
        await Promise.all([
          this.props.eventsInitialization(tosuId),
          this.props.bufferZoneInitialization(),
        ])

          // Then update the pofTree with current buffer and loaded events
          .then(() =>
            this.props.pofTreeUpdate(this.props.buffer, this.props.events)
          )

        // then remove activities from buffer if using touch device
        if (isTouchDevice()) {
          // Wait for all deletions to finish
          await Promise.all(
            this.props.buffer.activities.map(activity =>
              this.props.deleteActivityFromBuffer(activity.id)
            )
          ).catch(error => console.log('Error while emptying buffer', error))
        }
      }
    } catch (error) {
      console.log(error)
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
      this.props.taskgroup
    )
    this.props.addStatusInfo(status)
  }

  setHeaderHeight = height => {
    if (height !== this.state.bufferZoneHeight) {
      this.setState({ bufferZoneHeight: height })
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
    const { startDate, endDate } = this.state
    const initialEvents = this.props.events

    const eventsToShow = () =>
      filterEvents(view, initialEvents, startDate, endDate)

    let odd = true
    if (this.props.scout === null) {
      return (
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Login token="1059818174105-9p207ggii6rt2mld491mdbhqfvor2poc.apps.googleusercontent.com" />
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
          {eventsToShow().map(event => {
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

const mapStateToProps = state => ({
  notification: state.notification,
  buffer: state.buffer,
  events: state.events,
  pofTree: state.pofTree,
  taskgroup: state.taskgroup,
  scout: state.scout,
  loading: state.loading,
  tosu: state.tosu,
  ui: state.ui,
})

const mapDispatchToProps = {
  notify,
  pofTreeInitialization,
  pofTreeUpdate,
  eventsInitialization,
  bufferZoneInitialization,
  tosuInitialization,
  deleteActivityFromBuffer,
  addStatusInfo,
  scoutGoogleLogin,
  readScout,
  viewChange,
  setLoading,
}

App.propTypes = {
  ...PropTypesSchema,
}

App.defaultProps = {
  scout: PropTypes.shape({ id: '' }),
}

const AppDnD = DragDropContext(HTML5Backend)(App)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppDnD)
