import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import isTouchDevice from 'is-touch-device'
import React, { Component } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import 'react-sticky-header/styles.css'
import StickyHeader from 'react-sticky-header'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { default as TouchBackend } from 'react-dnd-touch-backend'
import NewEvent from './components/NewEvent'
import Appbar from './components/AppBar'
import Toggle from 'material-ui/Toggle'
import Notification from './components/Notification'
import ListEvents from './components/ListEvents'
import { notify } from './reducers/notificationReducer'
import { pofInitialization } from './reducers/pofActivityReducer'
import { bufferZoneInitialization } from './reducers/bufferZoneReducer'
import { eventsInitialization } from './reducers/eventReducer'
import NotificationFooter from './components/NotificationFooter'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'

const styles = {
  toggle: {
    backgroundColor: '#5DBCD2'
  },
  labelStyle:{
    color:'#FFF'
  }
}
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
      this.props.pofInitialization(),
      this.props.eventsInitialization(),
      this.props.bufferZoneInitialization(2) // id tulee userista myöhemmin
    ])
  }

  setHeaderHeight = height => {
    if (height !== this.state.bufferZoneHeight) {
      this.setState({ bufferZoneHeight: height })
    }
  }

  toggleTopBar = () => {
    const oldState = this.state.headerVisible

    if (oldState) {
      this.setState({
        bufferZoneHeight: 0,
        headerVisible: !this.state.headerVisible
      })
    } else {
      this.setState({
        headerVisible: !this.state.headerVisible
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
    return (
      <div className="App">
        <Router>
          <MuiThemeProvider>
            <StickyHeader
              // This is the sticky part of the header.
              header={
                <div className="Header_root">                
                  <Toggle label="Piilota / näytä aktiviteetit"                      
                      labelPosition="right" 
                      style={styles.toggle} 
                      onClick={this.toggleTopBar} 
                      labelStyle={styles.labelStyle}
                      />
                  {this.state.headerVisible ? (
                    <Appbar
                      setHeaderHeight={this.setHeaderHeight}
                    />
                  ) : null}
                </div>
              }
            >
              <section />
            </StickyHeader>
            <div
              id="container"
              style={{ paddingTop: this.state.bufferZoneHeight + 30 }}
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
                <NotificationFooter />
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
    notification: state.notification
  }
}

let AppDnD = DragDropContext(MultiBackend(HTML5toTouch))(App)

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
  eventsInitialization,
  bufferZoneInitialization
})(AppDnD)
