// Vendor
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import isTouchDevice from 'is-touch-device'
import MultiBackend from 'react-dnd-multi-backend'
import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import FontAwesome from 'react-fontawesome'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import { DialogTitle } from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import LinearProgress from '@material-ui/core/LinearProgress'
import moment from 'moment'
// CSS
import 'react-sticky-header/styles.css'
import "./index.css"
// Components
import NewEvent from './components/NewEvent'
import AppBar from './components/AppBar'
import MobileAppbar from './components/MobileAppbar'
import ClippedDraver from './components/ClippedDrawer'
import NotificationFooter from './components/NotificationFooter'
import UserInfo from './components/UserInfo'
import EventCard from './components/EventCard'
import KuksaEventCard from './components/KuksaEventCard'
import Calendar from './components/Calendar'
// Utils
import { createStatusMessage } from './utils/createStatusMessage'
import eventComparer from './utils/EventCompare'
// Services
import { getGoogleToken, removeGoogleToken, setGoogleToken, getScout } from './services/googleToken' // TODO: rename service
import pofService from './services/pof'
import { loadCachedPofData } from './services/localStorage'
import { API_ROOT } from './api-config'
// Reducers
import { notify } from './reducers/notificationReducer'
import { pofTreeInitialization, pofTreeUpdate } from './reducers/pofTreeReducer'
import { bufferZoneInitialization, deleteActivityFromBuffer } from './reducers/bufferZoneReducer'
import { eventsInitialization } from './reducers/eventReducer'
import { addStatusInfo } from './reducers/statusMessageReducer'
import { scoutLogin, readScout } from './reducers/scoutReducer'
import { filterChange } from './reducers/filterReducer'


class App extends Component {
  constructor() {
    super()
    this.state = {
      headerVisible: false,
      drawerVisible: true,
      bufferZoneHeight: 0,
      newEventVisible: false,
      shouldShowAllKuksaEvents: false,
      loading: true,
    }
  }

  componentDidMount = async () => {
    if (window.location.pathname === '/new-event') {
      this.setState({
        headerVisible: false,
        bufferZoneHeight: 0,
        newEventVisible: false
      })
    } else if (window.location.pathname === '/calendar') {
        this.props.store.dispatch(filterChange('CALENDAR'))
    }
    await this.checkLoggedIn()
    let pofData = loadCachedPofData()

    if (pofData === undefined || pofData === {}) {
      pofData = await pofService.getAllTree()
    }
    await Promise.all([
      this.props.pofTreeInitialization(pofData),
      this.props.eventsInitialization(),
      this.props.bufferZoneInitialization() // id tulee userista myöhemmin
    ])
    this.props.pofTreeUpdate(this.props.buffer, this.props.events)

    // If touch device is used, empty bufferzone so activities that have been left to bufferzone can be added to events
    if (isTouchDevice()) {
      const bufferActivities = this.props.buffer.activities
      const promises = bufferActivities.map(activity =>
        this.props.deleteActivityFromBuffer(activity.id)
      )
      try {
        await Promise.all(promises)
      } catch (exception) {
        console.log("Error in emptying buffer", exception)
      }
    }
    if (this.state.loading) {
      this.setState({ loading: false })
    }
  }

  componentDidUpdate = () => {
    const status = createStatusMessage(
      this.props.events,
      this.props.pofTree,
      this.props.taskgroup
    )
    this.props.addStatusInfo(status)
  }

  checkLoggedIn = async () => {
    // Google login
    if (getGoogleToken() !== null) {
      try {
        await this.props.scoutLogin(getGoogleToken())
      } catch (exception) {
        removeGoogleToken()
      }
    }
    // PartioID login
    if (getScout() !== null) {
      readScout()
    }
  }

  setHeaderHeight = height => {
    if (height !== this.state.bufferZoneHeight) {
      this.setState({ bufferZoneHeight: height })
    }
  }

  toggleDrawer = () => {
    this.setState({ drawerVisible: !this.state.drawerVisible })
  }

  googleLoginSuccess = async response => {
    if (this.props.scout === null) {
      await this.props.scoutLogin(response.tokenId)
      setGoogleToken(response.tokenId)
      await Promise.all([
        this.props.eventsInitialization(),
        this.props.bufferZoneInitialization()
      ])
      this.props.pofTreeUpdate(this.props.buffer, this.props.events)
    }
  }

  googleLoginFail = async response => {
    notify("Google-kirjautuminen epäonnistui. Yritä uudestaan.")
  }

  filterSelected = (value) => () => {
    this.props.store.dispatch(filterChange(value))
  }

  newEvent = () => {
    this.setState({ newEventVisible: true })
  }
  handleClose = () => {
    this.setState({ newEventVisible: false })
  }

  handleKuksaEventSwitchChange = () => {
    if (this.props.store.getState().filter === "KUKSA") {
      this.setState({
        shouldShowAllKuksaEvents: !this.state.shouldShowAllKuksaEvents
      })
    }
  }

  render() {
    const { events, filter } = this.props.store.getState()
    const shouldShowAllKuksaEvents = this.state.shouldShowAllKuksaEvents

    const eventsToShow = () => {
      const currentDate = moment().format('YYYY-MM-DD')
      // If filter is set to FUTURE, show all events with end date equal or greater than today
      // otherwise show events with end date less than today
      switch (filter) {
        case "FUTURE":
          return events.filter(event => event.endDate >= currentDate && !event.kuksaEvent).sort(eventComparer)
        case "ALL":
          return events.filter(event => !event.kuksaEvent).sort(eventComparer)
        case "KUKSA":
          if (shouldShowAllKuksaEvents) {
            return events.filter(event => event.kuksaEvent).sort(eventComparer)
          }
          return events.filter(event => event.endDate >= currentDate && event.kuksaEvent).sort(eventComparer)
        default:
          return events.sort(eventComparer)
      }
    }

    if (this.props.scout === null) {
      return (
        <div className="Login">
          {!isTouchDevice() ?
            (<p className="login-text">Toiminnan suunnittelusovellus</p>) :
            (<p className="login-mobile-text">Toiminnan suunnittelusovellus</p>)
          }

          <GoogleLogin
            className="login-button"
            scope="profile email"
            clientId="1059818174105-9p207ggii6rt2mld491mdbhqfvor2poc.apps.googleusercontent.com"
            onSuccess={this.googleLoginSuccess}
            onFailure={this.googleLoginFail}
          >
            <FontAwesome className="icon" name="google" />
            <span className="label">
              {' '}
              <span className="appbar-button-text">Kirjaudu sisään Googlella</span>
            </span>
          </GoogleLogin>
          <Button
            className="login-button"
            href={`${API_ROOT}/scouts/login`}
          >
            <span className="label">
              {' '}
              <span className="appbar-button-text">Kirjaudu sisään PartioID:llä</span>
            </span>
          </Button>
        </div>
      )
    }

    const dndMenu = () => (
      <AppBar
        toggleSideBar={this.toggleDrawer}
      />
    )

    const mobileMenu = () => (
      <MobileAppbar
        setHeaderHeight={this.setHeaderHeight}
        headerVisible={this.state.headerVisible}
      />
    )

    const kuksaEventsShowAllSwitch = (
      <FormControlLabel
        control={
          <Switch
            checked={shouldShowAllKuksaEvents}
            onClick={this.handleKuksaEventSwitchChange}
            color="primary"
          />
        }
        label="Näytä myös menneet tapahtumat"
      />
    )

    const eventsToList = (
      <div className='event-list-container'>
        {this.state.loading ? (<div className="loading-bar"><LinearProgress /></div>) : null}
        {filter === "KUKSA" ? (kuksaEventsShowAllSwitch) : null}
        <ul className='event-list'>
          {eventsToShow().map(event => (
            <li className='event-list-item' key={event.id ? event.id : 0}>
              {event.kuksaEvent ? (<KuksaEventCard event={event} />) : (<EventCard event={event} />)}
            </li>
          ))}
        </ul>
      </div>
    )

    const calendar = (
      <Calendar events={this.props.store.getState().events} />
    )

    return (
      <div className="App" >
        <Router>
          <div>
            <div>
              {isTouchDevice() ? mobileMenu() : dndMenu()}
            </div>
            <div className='flexbox'>
              {isTouchDevice() ? null :
                <div className={this.state.drawerVisible ? 'visible-drawer' : 'hidden-drawer'}>
                  <ClippedDraver />
                </div>
              }
              <div id="container" style={{ paddingTop: 0 }}>
                <div className="content">
                  <Button
                    className={this.props.store.getState().filter === 'FUTURE' ? 'active' : ''}
                    component={Link}
                    to="/"
                    onClick={this.filterSelected('FUTURE')}
                    variant="contained"
                  >
                    Tulevat
                  </Button>
                  &nbsp;
                  <Button
                    className={this.props.store.getState().filter === 'ALL' ? 'active' : ''}
                    component={Link}
                    to="/"
                    onClick={this.filterSelected('ALL')}
                    variant="contained"
                  >
                    Kaikki
                  </Button>
                  &nbsp;
                  <Button
                    className={this.props.store.getState().filter === 'KUKSA' ? 'active' : ''}
                    component={Link}
                    to="/"
                    onClick={this.filterSelected('KUKSA')}
                    variant="contained"
                  >
                    Kuksa
                  </Button>
                  &nbsp;
                  <Button
                    className={this.props.store.getState().filter === 'CALENDAR' ? 'active' : ''}
                    component={Link}
                    to="/calendar"
                    onClick={this.filterSelected('CALENDAR')}
                    variant="contained"
                  >
                    Kalenteri
                  </Button>
                  &nbsp;
                  <Button onClick={this.newEvent} variant="contained">
                    Uusi tapahtuma
                  </Button>
                  &nbsp;

                  <Route exact path="/" render={() => eventsToList} />
                  <Route exact path="/calendar" render={() => calendar} />

                  <Dialog open={this.state.newEventVisible} onClose={this.handleClose}>
                    <DialogTitle>Luo uusi tapahtuma</DialogTitle>
                    <NewEvent closeMe={this.handleClose} />
                  </Dialog>
                  <Route
                    path="/user-info"
                    render={() => <UserInfo />}
                  />
                  <NotificationFooter />
                </div>
              </div>
            </div>
          </div>
        </Router>
      </div>
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
  filter: state.filter
})

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend
    },
    {
      backend: HTML5Backend
    }
  ]
}

const AppDnD = DragDropContext(MultiBackend(HTML5toTouch))(App)

export default connect(mapStateToProps, {
  notify,
  pofTreeInitialization,
  pofTreeUpdate,
  eventsInitialization,
  bufferZoneInitialization,
  deleteActivityFromBuffer,
  addStatusInfo,
  scoutLogin,
  filterChange
})(AppDnD)
