// Vendor
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import isTouchDevice from 'is-touch-device'
import React, { Component } from 'react'
import { Dialog, DialogTitle, LinearProgress } from '@material-ui/core'
import moment from 'moment'
import 'react-dates/initialize'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { normalize } from 'normalizr'
// CSS
import 'react-dates/lib/css/_datepicker.css'
import 'react-sticky-header/styles.css'
import './stylesheets/react_dates_overrides.css'
import './stylesheets/index.css'
import theme from './theme'

// Components
import NewEvent from './components/NewEvent'
import AppBar from './components/AppBar'
import MobileAppbar from './components/MobileAppbar'
import ClippedDrawer from './components/ClippedDrawer'
import NotificationFooter from './components/NotificationFooter'
import EventCard from './components/EventCard'
import KuksaEventCard from './components/KuksaEventCard'
import Calendar from './components/Calendar'
import ButtonRow from './components/ButtonRow'
import FeedbackButton from './components/FeedbackButton'
import Login from './components/Login'
import PropTypesSchema from './components/PropTypesSchema'
import DeleteTosuButton from './components/DeleteTosuButton'
// Utils
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
import { viewChange } from './reducers/viewReducer'
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
    const view = this.props.view
    const { startDate, endDate } = this.state
    const initialEvents = () => {
      const events = eventList(this.props.events)
      events.forEach(event => {
        event.activities = event.activities.map(
          key => this.props.activities[key]
        )
      })
      return events
    }
    const eventsToShow = () =>
      filterEvents(view, initialEvents(), startDate, endDate)
    let odd = true
    if (this.props.scout === null) {
      return (
        <div className="Login">
          <Login
            token="1059818174105-9p207ggii6rt2mld491mdbhqfvor2poc.apps.googleusercontent.com"
            initialization={this.initialization}
          />
        </div>
      )
    }

    const mobileMenu = () => (
      <MobileAppbar
        setHeaderHeight={this.setHeaderHeight}
        headerVisible={this.state.headerVisible}
      />
    )

    const eventsToList = (
      <div className="event-list-container">
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

    const dndMenu = () => <AppBar toggleSideBar={this.toggleDrawer} />
    const calendar = (
      <Calendar events={this.props.events} mobile={isTouchDevice()} />
    )

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <div> {isTouchDevice() ? mobileMenu() : dndMenu()} </div>
          <div className="flexbox">
            {isTouchDevice() ? null : (
              <div
                className={
                  this.state.drawerVisible ? 'visible-drawer' : 'hidden-drawer'
                }
              >
                <ClippedDrawer />
              </div>
            )}
            <div id="container" style={{ paddingTop: 0 }}>
              <div className="content">
                <ButtonRow
                  view={this.state.view}
                  newEvent={this.newEvent}
                  dateRangeUpdate={this.dateRangeUpdate}
                  mobile={isTouchDevice()}
                />

                {this.props.loading ? (
                  <div className="loading-bar">
                    <LinearProgress />
                  </div>
                ) : null}
                {this.props.view === 'CALENDAR' ? calendar : eventsToList}
                <DeleteTosuButton initialization={this.initialization} />
                <Dialog
                  open={this.state.newEventVisible}
                  onClose={this.handleClose}
                >
                  <DialogTitle>Luo uusi tapahtuma</DialogTitle>
                  <NewEvent closeMe={this.handleClose} />
                </Dialog>
                <NotificationFooter />
              </div>
            </div>
          </div>
          <FeedbackButton
            feedback_url="https://docs.google.com/forms/d/e/1FAIpQLSddXqlQaFd8054I75s4UZEPeQAh_ardxRl11YYw3b2JBk0Y-Q/viewform"
            visible={!isTouchDevice()}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

App.propTypes = {
  ...PropTypesSchema,
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
  view: state.view,
  loading: state.loading,
  activities: state.activities,
  tosu: state.tosu,
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
