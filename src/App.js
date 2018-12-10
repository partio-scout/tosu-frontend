// Vendor
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import isTouchDevice from 'is-touch-device'
import MultiBackend from 'react-dnd-multi-backend'
import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import FontAwesome from 'react-fontawesome'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog'
import { DialogTitle } from '@material-ui/core'
import LinearProgress from '@material-ui/core/LinearProgress'
import moment from 'moment'
import 'react-dates/initialize'
// CSS
import 'react-dates/lib/css/_datepicker.css'
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
import ButtonRow from './components/ButtonRow'
// Utils
import { createStatusMessage } from './utils/createStatusMessage'
import filterEvents from './functions/filterEvents'
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
import { scoutGoogleLogin, readScout } from './reducers/scoutReducer'
import { filterChange } from './reducers/filterReducer'
import { viewChange } from './reducers/viewReducer'


class App extends Component {
  constructor() {
    super()
    const currentDate = moment()
    this.state = {
      headerVisible: false,
      drawerVisible: true,
      bufferZoneHeight: 0,
      newEventVisible: false,
      loading: true,
      startDate: currentDate,
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
      this.props.store.dispatch(viewChange('CALENDAR'))
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
    this.filterUpdate()
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
      await this.props.readScout() // Reads scout from a cookie. (Has only name)
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
      this.setState({ loading: true })

      await this.props.scoutGoogleLogin(response.tokenId)
      setGoogleToken(response.tokenId)
      await Promise.all([
        this.props.eventsInitialization(),
        this.props.bufferZoneInitialization()
      ])
      this.props.pofTreeUpdate(this.props.buffer, this.props.events)
      this.setState({ loading: false })
    }
  }

  googleLoginFail = async response => {
    notify("Google-kirjautuminen epäonnistui. Yritä uudestaan.")
  }

  selectView = (value) => () => {
    this.props.store.dispatch(viewChange(value))
  }

  filterSelected = (value) => () => {
    this.props.store.dispatch(filterChange(value))
  }

  newEvent = () => (this.setState({ newEventVisible: true }))
  handleClose = () => (this.setState({ newEventVisible: false }))

  filterUpdate = () => {
    if (this.state.startDate && this.state.endDate) {
      this.filterSelected('RANGE')()
    }
    if (this.state.startDate && !this.state.endDate) {
      this.filterSelected('ONLY_START')()
    }
    if (!this.state.startDate && this.state.endDate) {
      this.filterSelected('ONLY_END')()
    }
  }

  dateRangeUpdate = ({startDate, endDate}) => {
    this.setState({startDate, endDate})
  }

  render() {
    const { view, filter } = this.props.store.getState()
    const { startDate, endDate } = this.state
    const initialEvents = this.props.store.getState().events
    const eventsToShow = () => (filterEvents(view, filter, initialEvents, startDate, endDate))

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
            style={{ backgroundColor: 'transparent' }}
            href={`${API_ROOT}/scouts/login`}
          >
            <span className="login-button">
              {' '}
              <span className="appbar-button-text">Kirjaudu sisään PartioID:llä</span>
            </span>
          </Button>
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
      <div className='event-list-container'>
        {view === "KUKSA"}
        <ul className='event-list'>
          {eventsToShow().map(event => (
            <li className='event-list-item' key={event.id ? event.id : 0}>
              {event.kuksaEvent ? (<KuksaEventCard event={event} />) : (<EventCard event={event} />)}
            </li>
          ))}
        </ul>
      </div>
    )

    const dndMenu = () => (<AppBar toggleSideBar={this.toggleDrawer} />)
    const calendar = (<Calendar events={this.props.store.getState().events} />)
    
    return (
      <div className="App" >
        <Router>
          <div>
            <div> {isTouchDevice() ? mobileMenu() : dndMenu()} </div>
            <div className='flexbox'>
              {isTouchDevice() ? null :
                <div className={this.state.drawerVisible ? 'visible-drawer' : 'hidden-drawer'}>
                  <ClippedDraver />
                </div>
              }
              <div id="container" style={{ paddingTop: 0 }}>
                <div className="content">
                  <ButtonRow
                    view={this.state.view}
                    filter={this.state.filter}
                    newEvent={this.newEvent} 
                    dateRangeUpdate={this.dateRangeUpdate}
                  />

                  {this.state.loading ? (<div className="loading-bar"><LinearProgress /></div>) : null}
                  {this.props.store.getState().view === 'CALENDAR' ? calendar : eventsToList}

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
  filter: state.filter,
  view: state.view
})

const HTML5toTouch = {
  backends: [{backend: HTML5Backend}, {backend: HTML5Backend}]}

const AppDnD = DragDropContext(MultiBackend(HTML5toTouch))(App)

export default connect(mapStateToProps, {
  notify,
  pofTreeInitialization,
  pofTreeUpdate,
  eventsInitialization,
  bufferZoneInitialization,
  deleteActivityFromBuffer,
  addStatusInfo,
  scoutGoogleLogin,
  readScout,
  filterChange,
  viewChange,
})(AppDnD)
