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
import { Button, Dialog, DialogTitle, LinearProgress } from '@material-ui/core'
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
import UserInfo from './components/UserInfo'
import EventCard from './components/EventCard'
import KuksaEventCard from './components/KuksaEventCard'
import Calendar from './components/Calendar'
import ButtonRow from './components/ButtonRow'
import FeedbackButton from './components/FeedbackButton'
import Login from './components/Login'
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
import { setLoading } from './reducers/loadingReducer'



class App extends Component {
  constructor() {
    super()
    const currentDate = moment()
    this.state = {
      headerVisible: false,
      drawerVisible: true,
      bufferZoneHeight: 0,
      newEventVisible: false,
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
        console.log('Error in emptying buffer', exception)
      }
    }
    if (this.props.store.getState().loading) {
      this.props.setLoading(false)
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

  setHeaderHeight = height => {
    if (height !== this.state.bufferZoneHeight) {
      this.setState({ bufferZoneHeight: height })
    }
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

  toggleDrawer = () => {
    this.setState({ drawerVisible: !this.state.drawerVisible })
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
    let odd = true
    if (this.props.scout === null) {
      return (
        <div className='Login'>
        <Login store={this.props.store} token={"1059818174105-9p207ggii6rt2mld491mdbhqfvor2poc.apps.googleusercontent.com"}/>
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
        {view === 'KUKSA'}
        <ul className={isTouchDevice() ? 'mobile-event-list event-list' : 'event-list'}>
          {eventsToShow().map(event => {
            odd=!odd
            return(
              <li className='event-list-item' key={event.id ? event.id : 0}>
                {event.kuksaEvent ? (<KuksaEventCard event={event} />) : (<EventCard event={event} odd={odd} />)}
              </li>
            )}
          )}
        </ul>
      </div>
    )

    const dndMenu = () => (<AppBar toggleSideBar={this.toggleDrawer} />)
    const calendar = (
      <Calendar
        events={this.props.store.getState().events}
        mobile={isTouchDevice()}
      />
    )

    return (
      <MuiThemeProvider theme={theme}>
        <div className='App' >
          <Router>
            <div>
              <div> {isTouchDevice() ? mobileMenu() : dndMenu()} </div>
              <div className='flexbox'>
                {isTouchDevice() ? null :
                  <div className={this.state.drawerVisible ? 'visible-drawer' : 'hidden-drawer'}>
                    <ClippedDrawer />
                  </div>
                }
                <div id='container' style={{ paddingTop: 0 }}>
                  <div className='content'>
                    <ButtonRow
                      view={this.state.view}
                      filter={this.state.filter}
                      newEvent={this.newEvent}
                      dateRangeUpdate={this.dateRangeUpdate}
                      mobile={isTouchDevice()}
                    />

                    {this.props.store.getState().loading ? (<div className='loading-bar'><LinearProgress /></div>) : null}
                    {this.props.store.getState().view === 'CALENDAR' ? calendar : eventsToList}

                    <Dialog open={this.state.newEventVisible} onClose={this.handleClose}>
                      <DialogTitle>Luo uusi tapahtuma</DialogTitle>
                      <NewEvent closeMe={this.handleClose} />
                    </Dialog>
                    <Route
                      path='/user-info'
                      render={() => <UserInfo />}
                    />
                    <NotificationFooter />
                  </div>
                </div>
              </div>
             <FeedbackButton feedback_url='https://docs.google.com/forms/d/e/1FAIpQLSddXqlQaFd8054I75s4UZEPeQAh_ardxRl11YYw3b2JBk0Y-Q/viewform'/>
            </div>
          </Router>
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
  filter: state.filter,
  view: state.view,
  loading: state.loading
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
  setLoading,
})(AppDnD)
