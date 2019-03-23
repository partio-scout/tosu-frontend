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

// CSS
import 'react-dates/lib/css/_datepicker.css'
import 'react-sticky-header/styles.css'
import './react_dates_overrides.css'
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
// Utils
import filterEvents from './functions/filterEvents'

// Services
import {
  getGoogleToken,
  removeGoogleToken,
  getScout,
} from './services/googleToken'

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
import { viewChange } from './reducers/viewReducer'
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
    // Load pofData and put it in Redux store
    try {
    } catch (error) {
      console.log(error)
    }
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
    // PartioID login (BROKEN)
    if (getScout() !== null) {
      this.props.readScout() // Reads scout from a cookie. (Has only name)
    }

    // Finish loading after everything above is done
    this.props.setLoading(false)
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
    const view = this.props.view
    const { startDate, endDate } = this.state
    const initialEvents = this.props.events
    const eventsToShow = () =>
      filterEvents(view, initialEvents, startDate, endDate)
    let odd = true
    if (this.props.scout === null) {
      return (
        <div className="Login">
          <Login token="1059818174105-9p207ggii6rt2mld491mdbhqfvor2poc.apps.googleusercontent.com" />
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

const mapStateToProps = state => ({
  notification: state.notification,
  buffer: state.buffer,
  events: state.events,
  pofTree: state.pofTree,
  taskgroup: state.taskgroup,
  scout: state.scout,
  view: state.view,
  loading: state.loading,
  tosu: state.tosu,
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
