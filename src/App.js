import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import isTouchDevice from 'is-touch-device'
import MultiBackend from 'react-dnd-multi-backend'
import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login'
import FontAwesome from 'react-fontawesome'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import moment from 'moment'
import 'react-sticky-header/styles.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import NewEvent from './components/NewEvent'
import AppBar from './components/AppBar'
import MobileAppbar from './components/MobileAppbar'
import ClippedDraver from './components/ClippedDraver'
import { notify } from './reducers/notificationReducer'
import { pofTreeInitialization, pofTreeUpdate } from './reducers/pofTreeReducer'
import {
  bufferZoneInitialization,
  deleteActivityFromBuffer
} from './reducers/bufferZoneReducer'
import { eventsInitialization } from './reducers/eventReducer'
import NotificationFooter from './components/NotificationFooter'
import UserInfo from './components/UserInfo'
import { createStatusMessage } from './utils/createStatusMessage'
import { addStatusInfo } from './reducers/statusMessageReducer'
import { scoutLogin } from './reducers/scoutReducer'
import { getGoogleToken, removeGoogleToken, setGoogleToken } from './services/googleToken'
import pofService from './services/pof'
import { loadCachedPofData } from './services/localStorage'
import eventComparer from './utils/EventCompare'
import EventCard from './components/EventCard'
import { filterChange } from './reducers/filterReducer'
import "./index.css";
import { DialogTitle } from '@material-ui/core';

class App extends Component {
  constructor() {
    super()
    this.state = {
      bufferZoneHeight: 0,
      headerVisible: false,
      drawerVisible: true
    }
  }

  componentDidMount = async () => {
    if (window.location.pathname === '/new-event') {
      this.setState({
        headerVisible: false,
        bufferZoneHeight: 0,
      })
    }
    if (getGoogleToken() !== null) {
      try {
        await this.props.scoutLogin(getGoogleToken())
      } catch (exception) {
        removeGoogleToken()
      }
    }
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
  }

  componentDidUpdate = () => {
    const status = createStatusMessage(
      this.props.events,
      this.props.pofTree,
      this.props.taskgroup
    )
    this.props.addStatusInfo(status)
  }

/*   setHeaderHeight = height => {
    if (height !== this.state.bufferZoneHeight) {
      this.setState({ bufferZoneHeight: height })
    }
  } */

  toggleDrawer = () => {
    this.setState({ drawerVisible: !this.state.drawerVisible })
  }

  googleLoginSuccess = async response => {
    if (this.props.scout === null) {
      await this.props.scoutLogin(response.tokenId)
      setGoogleToken(response.tokenId)
      await Promise.all([
        this.props.eventsInitialization(),
        this.props.bufferZoneInitialization()// //////////////////
      ])
      this.props.pofTreeUpdate(this.props.buffer, this.props.events)
    }
  }

  googleLoginFail = async response => {
    // console.log('login failed')
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

  render() {
    const eventsToShow = () => {
      const currentDate = moment().format('YYYY-MM-DD')
      const { events, filter } = this.props.store.getState()
      // If filter is set to FUTURE, show all events with end date equal or greater than today
      // otherwise show events with end date less than today
      return filter === 'FUTURE'
        ? events.filter(event => event.endDate >= currentDate).sort(eventComparer)
        : events.filter(event => event.endDate < currentDate).sort(eventComparer)
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
            clientId="7360124073-8f1bq4mul415hr3kdm154vq3c65lp36d.apps.googleusercontent.com"
            onSuccess={this.googleLoginSuccess}
            onFailure={this.googleLoginFail}
          >
            <FontAwesome className="icon" name="google" />
            <span className="label">
              {' '}
              <span className="appbar-button-text">Kirjaudu sisään</span>
            </span>
          </GoogleLogin>
        </div>
      )
    }
    const selfInfo = (
      <p className="appbar-user"><span>{this.props.scout.name}</span></p>
      /* <Link to="/user-info">
        <button className="appbar-button" onClick={this.hideTopBar}>
          <FontAwesome className="icon" name="user" />

          {!isTouchDevice() ? (
            <span className="appbar-button-text">Omat tiedot</span>
          ) : null}
        </button>
      </Link> */
    )
    const dndMenu = () => (
      <AppBar
        // setHeaderHeight={this.setHeaderHeight}
        toggleSideBar={this.toggleDrawer}
        headerVisible={this.state.headerVisible}
        selfInfo={selfInfo}
      />
    )

    const mobileMenu = () => (
      <MobileAppbar
        // setHeaderHeight={this.setHeaderHeight}
        headerVisible={this.state.headerVisible}
        selfInfo={selfInfo}
      />
    )

    const events = (
      <div>
        {eventsToShow().map(event => (
          <EventCard
            key={event.id ? event.id : 0}
            event={event}
          />
        ))}
      </div>
    )

    return (
      <div className="App" >
        <Router>
          <div>
            <div>
              {isTouchDevice() ? mobileMenu() : dndMenu()}
            </div>
            <div style={{ display: 'flex', width: '100%' }}>
              <div className={this.state.drawerVisible ? 'visible-drawer' : 'hidden-drawer'}>
                <ClippedDraver />
              </div>
              <div id="container" style={{ paddingTop: 0 }}>
                <div className="content">
                  <Button
                    className={this.props.store.getState().filter === 'FUTURE' ? 'active' : ''}
                    component={Link}
                    to="/"
                    onClick={this.filterSelected('FUTURE')}
                    variant="contained"
                  >
                    Tulevat tapahtumat
                  </Button>
                  &nbsp;
                  <Button
                    className={this.props.store.getState().filter === 'PAST' ? 'active' : ''}
                    component={Link}
                    to="/"
                    onClick={this.filterSelected('PAST')}
                    variant="contained"
                  >
                    Menneet tapahtumat
                  </Button>
                  &nbsp;
                  <Button onClick={this.newEvent} variant="contained">
                    Uusi tapahtuma
                  </Button>
                    &nbsp;
                  <Route exact path="/" render={() => events} />
                  <Dialog open={this.state.newEventVisible} onClose={this.handleClose}>
                    <DialogTitle>{'Luo uusi tapahtuma'}</DialogTitle>
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
