import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { StickyContainer, Sticky } from 'react-sticky'
import NewEvent from './components/NewEvent'
import Appbar from './components/AppBar'
//import activitiesData from './partio.json'
import { connect } from 'react-redux'
import Notification from './components/Notification'
import ListEvents from './components/ListEvents'
import { notify} from './reducers/notificationReducer'
import {pofInitialization} from './reducers/pofActivityReducer'
import {bufferZoneInitialization} from './reducers/bufferZoneReducer'
import {eventsInitialization} from './reducers/eventReducer'

class App extends Component {
  constructor() {
    super()
    this.state = {
      bufferZoneHeight: 0
    }
  }

  componentDidMount = async () => {

      await this.props.pofInitialization()
      await this.props.eventsInitialization()
      await this.props.bufferZoneInitialization(2)//id tulee userista myöhemmin

  }

  setHeaderHeight = height => {
    if (height !== this.state.bufferZoneHeight) {
      this.setState({ bufferZoneHeight: height })
    }
  }
/*
  updateBufferZoneActivities = activity => {
    const activities = this.state.bufferZoneActivities.activities.concat(
      activity
    )
    const newBufferZoneActivities = this.state.bufferZoneActivities
    newBufferZoneActivities.activities = activities
    this.setState({ bufferZoneActivities: newBufferZoneActivities })
  }

  deleteFromBufferZone = activity => {
    const newBufferZoneActivities = this.state.bufferZoneActivities
    const index = this.state.bufferZoneActivities.activities.indexOf(activity)
    const activitiesAfterDelete = this.state.bufferZoneActivities.activities
    activitiesAfterDelete.splice(index, 1)
    newBufferZoneActivities.activities = activitiesAfterDelete
    this.setState({
      bufferZoneActivities: newBufferZoneActivities
    })
  }*/

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
export default connect(
  mapStateToProps,
  { notify, pofInitialization, bufferZoneInitialization, eventsInitialization }

)(App)

