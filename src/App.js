import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { StickyContainer, Sticky } from 'react-sticky'
import NewEvent from './components/NewEvent'
import Appbar from './components/AppBar'
//import activitiesData from './partio.json'
import eventService from './services/events'
import activityService from './services/activities'
import filterOffExistingOnes from './functions/searchBarFiltering'
import { connect } from 'react-redux'
import Notification from './components/Notification'
import ListEvents from './components/ListEvents'
import { notify} from './reducers/notificationReducer'
import {pofInitialization} from './reducers/pofActivityReducer'

class App extends Component {
  constructor() {
    super()
    this.state = {
      events: [{}],
      bufferZoneActivities: [],
      bufferZoneHeight: 0
    }
  }

  componentDidMount = async () => {
    await this.getEvents()

    const update = async () => {
      await this.props.pofInitialization()
      await this.getBufferZoneActivities()
    }

    update()
  }

  getEvents = async () => {
    try {
      const events = await eventService.getAll()
      this.setState({
        events
      })
    } catch (exception) {
      this.setState({
        events: []
      })
    }
  }

  getBufferZoneActivities = async () => {
    try {
      const bufferZoneActivities = await activityService.getBufferZoneActivities()
      this.setState({
        bufferZoneActivities
      })
    } catch (exception) {
      console.error(exception)
    }
  }

  setHeaderHeight = height => {
    if (height !== this.state.bufferZoneHeight) {
      this.setState({ bufferZoneHeight: height })
    }
  }

  updateEvents = () => {
    this.getEvents()
  }

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
  }

  updateFilteredActivities = async () => {
    await this.getEvents()
  }

  render() {
    console.log('Height', this.state.bufferZoneHeight)
    return (
      <StickyContainer className="App">
        <MuiThemeProvider>
          <div
            id="container"
            style={{ paddingTop: this.state.bufferZoneHeight }}
          >
            <div className="content">
              <NewEvent updateEvents={this.updateEvents} />
              <Notification />
              <ListEvents
                events={this.state.events}
                fetchEvents={this.getEvents}
                updateFilteredActivities={this.updateFilteredActivities}
                setNotification={this.setNotification}
              />
            </div>
            <Sticky>
              {({ style }) => (
                <header style={style}>
                  <Appbar
                    activities={this.state.activities}
                    events={this.state.events}
                    bufferZoneActivities={this.state.bufferZoneActivities}
                    updateFilteredActivities={this.updateFilteredActivities}
                    bufferZoneUpdater={this.updateBufferZoneActivities}
                    deleteFromBufferZone={this.deleteFromBufferZone}
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
  { notify, pofInitialization }

)(App)

