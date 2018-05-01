import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import isTouchDevice from 'is-touch-device'
import MultiBackend from 'react-dnd-multi-backend'
import React, { Component } from 'react'
//import { GoogleLogin, GoogleLogout } from 'react-google-login'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FontAwesome from 'react-fontawesome'
import RaisedButton from 'material-ui/RaisedButton'
import 'react-sticky-header/styles.css'
import StickyHeader from 'react-sticky-header'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import NewEvent from './components/NewEvent'
import Appbar from './components/AppBar'
import MobileAppbar from './components/MobileAppbar'
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
import { userLogin } from './reducers/userReducer'
import { getGoogleToken } from './services/googleToken'
import CookieConsent from 'react-cookie-consent'
import pofService from './services/pof'
import { loadCachedPofData } from './services/localStorage'
import eventComparer from './utils/EventCompare'
import EventCard from './components/EventCard'

class App extends Component {
  constructor() {
    super()
    this.state = {
      bufferZoneHeight: 0,
      headerVisible: true
    }
  }

  componentDidMount = async () => {
    if (window.location.pathname === '/new-event') {
      this.setState({
        headerVisible: false,
        bufferZoneHeight: 0
      })
    }
    if (getGoogleToken().headers.Authorization !== null) {
      await this.props.userLogin()
    }
    let pofData = loadCachedPofData()

    if (pofData === undefined || pofData === {}) {
      pofData = await pofService.getAllTree()
    }
    await Promise.all([
      this.props.pofTreeInitialization(pofData),
      this.props.eventsInitialization(),
      this.props.bufferZoneInitialization(2) // id tulee userista myöhemmin
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

  setHeaderHeight = height => {
    if (height !== this.state.bufferZoneHeight) {
      this.setState({ bufferZoneHeight: height })
    }
  }

  toggleTopBar = () => {
    if (this.state.headerVisible) {
      this.setState({
        headerVisible: false,
        bufferZoneHeight: 10
      })
    } else {
      this.setState({
        headerVisible: true
      })
    }
  }

  hideTopBar = () => {
    if (this.state.headerVisible) {
      this.toggleTopBar()
    }
  }

  openTopBar = () => {
    if (!this.state.headerVisible) {
      this.toggleTopBar()
    }
  }

  sortedEvents = () => {
    return this.props.events.sort(eventComparer) 
  }

  listOfEvents = () => {
    const events = this.sortedEvents()
    return events.map(event => (
      <EventCard
        key={event.id ? event.id : 0}
        event={event}
      />
    ))
  }

  render() {
    const padding = this.state.headerVisible ? this.state.bufferZoneHeight : 70
    const selfInfo = (
      <Link to="/user-info">
        <button className="appbar-button" onClick={this.hideTopBar}>
          <FontAwesome className="icon" name="user" />

          {!isTouchDevice() ? (
            <span className="appbar-button-text">Omat tiedot</span>
          ) : null}
        </button>
      </Link>
    )
    const dndMenu = () => (
      <Appbar
        setHeaderHeight={this.setHeaderHeight}
        toggleTopBar={this.toggleTopBar}
        headerVisible={this.state.headerVisible}
        selfInfo={selfInfo}
      />
    )

    const mobileMenu = () => (
      <MobileAppbar
        setHeaderHeight={this.setHeaderHeight}
        headerVisible={this.state.headerVisible}
        selfInfo={selfInfo}
      />
    )

    const events = (
      <div>
        {this.listOfEvents()}
      </div>
    )

    return (
      <div className="App" >
        <Router>
          <MuiThemeProvider>
            <div>
              <StickyHeader
                // This is the sticky part of the header.
                header={
                  <div>
                    {isTouchDevice() ? mobileMenu() : dndMenu()}

                    <CookieConsent
                      buttonText="Hyväksyn evästeiden käytön"
                      cookieName="myAwesomeCookieName2"
                      style={{ background: '#2B373B' }}
                      buttonStyle={{ color: '#4e503b', fontSize: '14px' }}
                    >
                      Tämä sivusto käyttää evästeitä.{' '}
                    </CookieConsent>
                  </div>
                }
              />
              <section />

              <div id="container" style={{ paddingTop: padding }}>
                <div className="content">
                  <Link to="/">
                    <RaisedButton
                      label="Lista tapahtumista"
                      onClick={this.openTopBar}
                    />
                  </Link>
                  &nbsp;
                  <Link to="/new-event">
                    <RaisedButton
                      label="Uusi tapahtuma"
                      onClick={this.hideTopBar}
                    />
                  </Link>
                  &nbsp;
                  <Route exact path="/" render={() => events} />
                  <Route
                    path="/new-event"
                    render={() => <NewEvent toggleTopBar={this.toggleTopBar} />}
                  />
                  <Route
                    path="/user-info"
                    render={() => <UserInfo toggleTopBar={this.toggleTopBar} />}
                  />
                  <NotificationFooter />
                </div>
              </div>
            </div>
          </MuiThemeProvider>
        </Router>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    notification: state.notification,
    buffer: state.buffer,
    events: state.events,
    pofTree: state.pofTree,
    taskgroup: state.taskgroup
  }
}

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
  userLogin
})(AppDnD)
