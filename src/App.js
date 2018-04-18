import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import TouchBackend from 'react-dnd-touch-backend'
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend'
import React, { Component } from 'react'
//import { GoogleLogin, GoogleLogout } from 'react-google-login'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import 'react-sticky-header/styles.css'
import StickyHeader from 'react-sticky-header'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import NewEvent from './components/NewEvent'
import Appbar from './components/AppBar'
import ListEvents from './components/ListEvents'
import { notify } from './reducers/notificationReducer'
import { pofTreeInitialization, pofTreeUpdate } from './reducers/pofTreeReducer'
import { bufferZoneInitialization } from './reducers/bufferZoneReducer'
import { eventsInitialization } from './reducers/eventReducer'
import { addStatusInfo } from './reducers/statusMessageReducer'
import NotificationFooter from './components/NotificationFooter'
import UserInfo from './components/UserInfo'
import { createStatusMessage } from './utils/createStatusMessage'

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
    await Promise.all([
      this.props.pofTreeInitialization(),
      this.props.eventsInitialization(),
      this.props.bufferZoneInitialization(2) // id tulee userista myöhemmin
    ])
    this.props.pofTreeUpdate(this.props.buffer, this.props.events)
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
  render() {
    const padding = this.state.headerVisible ? this.state.bufferZoneHeight : 60
    return (
      <div className="App">
        <Router>
          <MuiThemeProvider>
            <div>
              <StickyHeader
                // This is the sticky part of the header.
                header={
                  <div>
                    <Appbar
                      setHeaderHeight={this.setHeaderHeight}
                      toggleTopBar={this.toggleTopBar}
                      headerVisible={this.state.headerVisible}
                      selfInfo={
                        <Link to="/user-info">
                          <RaisedButton
                            label='Omat tiedot'
                            style={{ float: 'right', marginRight: 5, marginTop: 20 }}
                            onClick={this.hideTopBar}
                          />
                        </Link>
                      }
                    />
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
                  <Route exact path="/" render={() => <ListEvents />} />
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
      backend: TouchBackend({ enableMouseEvents: true }), // Note that you can call your backends with options
      // preview: true,
      transition: TouchTransition
    }
  ]
}

const AppDnD = DragDropContext(MultiBackend(HTML5toTouch))(App)

/* if (!isTouchDevice()) {
  console.log('ei touch')
AppDnD = DragDropContext(HTML5Backend)(App)
} else {
  console.log('touch')
AppDnD = DragDropContext(TouchBackend({ enableMouseEvents: true }))(App)
} */

export default connect(mapStateToProps, {
  notify,
  pofTreeInitialization,
  pofTreeUpdate,
  eventsInitialization,
  bufferZoneInitialization,
  addStatusInfo
})(AppDnD)
