import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import isTouchDevice from 'is-touch-device'
import React, { Component } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { StickyContainer, Sticky } from 'react-sticky'
import NewEvent from './components/NewEvent'
import Appbar from './components/AppBar'
import Notification from './components/Notification'
import { default as TouchBackend } from 'react-dnd-touch-backend';
import ListEvents from './components/ListEvents'
import { notify} from './reducers/notificationReducer'
import {pofInitialization} from './reducers/pofActivityReducer'
import { bufferZoneInitialization } from './reducers/bufferZoneReducer'
import { eventsInitialization } from './reducers/eventReducer'


class App extends Component {
  constructor() {
    super()
    this.state = {
      bufferZoneHeight: 0
    }
  }

  componentDidMount = async () => {

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

  render() {
    return (
      <StickyContainer className="App">
        <MuiThemeProvider>
          <div
            id="container"
            style={{ paddingTop: this.state.bufferZoneHeight }}
          >
            <div className="content">
              <NewEvent />
              <Notification />
              <ListEvents />
            </div>
            <Sticky>
              {({ style }) => (
                <header style={style}>
                  <Appbar
                //    bufferZoneUpdater={this.updateBufferZoneActivities}
                  //  deleteFromBufferZone={this.deleteFromBufferZone}
                    setHeaderHeight={this.setHeaderHeight}
                  />
                </header>
              )}
            </Sticky>
          </div>
        </MuiThemeProvider>
      </StickyContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
    notification: state.notification
  }
}



// let AppDnD

/* if (!isTouchDevice()) {
  console.log('ei oo') */
 const AppDnD = DragDropContext(HTML5Backend)(App)
// } else {
  // console.log('on')
  // AppDnD = DragDropContext(TouchBackend)(App)
// }


export default connect(
  mapStateToProps,
  { notify, pofInitialization, eventsInitialization, bufferZoneInitialization }

)(AppDnD)
