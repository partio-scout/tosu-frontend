import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import 'react-sticky-header/styles.css'
import StickyHeader from 'react-sticky-header'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import NewEvent from './components/NewEvent'
import Appbar from './components/AppBar'
import Toggle from 'material-ui/Toggle'
import ListEvents from './components/ListEvents'
import { notify } from './reducers/notificationReducer'
import { pofInitialization } from './reducers/pofActivityReducer'
import { pofTreeInitialization, pofTreeUpdate } from './reducers/pofTreeReducer'
import { bufferZoneInitialization } from './reducers/bufferZoneReducer'
import { eventsInitialization } from './reducers/eventReducer'
import NotificationFooter from './components/NotificationFooter'
import UserInfo from './components/UserInfo'
import FontAwesome from 'react-fontawesome'
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';

const styles = {
  toggle: {
    backgroundColor: '#5DBCD2'
  },
  labelStyle: {
    color: '#FFF'
  }
}
class App extends Component {
  constructor() {
    super()
    this.state = {
      bufferZoneHeight: 0,
      headerVisible: true,
      isLoggedIn: false
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
      this.props.pofInitialization(),
      this.props.pofTreeInitialization(),
      this.props.eventsInitialization(),
      this.props.bufferZoneInitialization(2) // id tulee userista myöhemmin
    ])
    this.props.pofTreeUpdate(this.props.buffer, this.props.events)
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
    const padding = this.state.headerVisible ? 0 : 60
    return (
      <div className="App">
        <Router>
          <MuiThemeProvider>
            <StickyHeader
              // This is the sticky part of the header.
              header={
                <div className="Header_root" id="header_root">
                  <Toolbar style={styles.toggle}>
                    <ToolbarGroup firstChild={true}>
                      <Toggle
                        label="Piilota / näytä aktiviteetit"
                        labelPosition="right"
                        style={styles.toggle}
                        onClick={this.toggleTopBar}
                        labelStyle={styles.labelStyle}
                      />
                    </ToolbarGroup>
                    <ToolbarGroup>
                      {!this.state.isLoggedIn ?
                        <GoogleLogin
                          className='customBtn'
                          scope='profile email'
                          clientId="7360124073-g6v17rganpibf9pglm8anhgv2te34un0.apps.googleusercontent.com"
                          onSuccess={(response) => { this.state(() => { return { isLoggedIn: true } }) }}
                          onFailure={(response) => { this.state(() => { return { isLoggedIn: false } }) }}
                        >
                          <FontAwesome className='icon' name='google' size='2x' />
                          <span className='label'>LOGIN WITH GOOGLE</span>
                        </GoogleLogin>
                        :
                        <div>
                          <Link to="/user-info">
                            <RaisedButton
                              label='Omat tiedot'
                              style={{ float: 'right', marginRight: 5, marginTop: 20 }}
                              onClick={this.hideTopBar}
                            />
                          </Link>
                          <GoogleLogout
                            className='customBtn'
                            scope='profile email'
                            onLogoutSuccess={(response) => { this.state(() => { return { isLoggedIn: false } }) }}
                          >
                            <FontAwesome className='icon' name="sign-out" size='2x' />
                            <span className='label'>SIGN OUT</span>
                          </GoogleLogout>
                        </div>

                      }
                    </ToolbarGroup>
                  </Toolbar>
                </div>
              }
            >
            </StickyHeader>
            <section />
            <div>
              {this.state.headerVisible ?
                <Appbar
                  setHeaderHeight={this.setHeaderHeight}
                />
                : this.setHeaderHeight(10)

              }
            </div>
            <div
              id="container"
              style={{ paddingTop: padding }}
            >
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
                  path='/user-info'
                  render={() => <UserInfo toggleTopBar={this.toggleTopBar} />}
                />
                <NotificationFooter />
              </div>
            </div>
          </MuiThemeProvider>
        </Router>
      </div >
    )
  }
}

const responseGoogle = (response) => {
  console.log(response)
}

const mapStateToProps = state => {
  return {
    notification: state.notification,
    buffer: state.buffer,
    events: state.events
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
};

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
  pofInitialization,
  pofTreeInitialization,
  pofTreeUpdate,
  eventsInitialization,
  bufferZoneInitialization
})(AppDnD)
