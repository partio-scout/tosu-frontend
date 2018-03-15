import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { StickyContainer, Sticky } from 'react-sticky'
import ListEvents from './components/ListEvents'
import NewEvent from './components/NewEvent'
import Appbar from './components/AppBar'
import activitiesData from './partio.json'
import eventService from './services/events'
import activityService from './services/activities'
import filterOffExistingOnes from './functions/searchBarFiltering'
import activitiesArray from './utils/NormalizeActivitiesData'
import { connect } from 'react-redux'
import Notification from './components/Notification'
import DragDropContext from 'react-dnd/lib/DragDropContext';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend'

class App extends Component {
  constructor() {
    super()
    this.state = {
      events: [{}],
      bufferZoneActivities: [],
      activities: [],
      filteredActivities: []
    }
  }

  componentDidMount() {
    this.getEvents()

    const update = () => {
      this.getActivities()
      this.updateFilteredActivities()
      this.getBufferZoneActivities()
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

  getActivities = async () => {
    try {
      const activities = await activityService.getAll()
      this.setState({
        activities: activitiesArray(activities)
      })
    } catch (exception) {
      // Jos tietoja ei saada haettua, hae tiedot staattisesta JSON-tiedostosta

      this.setState({
        activities: activitiesArray(activitiesData)
      })
    }
  }


  updateEvents = () => {
    this.getEvents()
  }

  updateBufferZoneActivities = (activity) => {
    const activities = this.state.bufferZoneActivities.activities.concat(activity)
    const newBufferZoneActivities = this.state.bufferZoneActivities
    newBufferZoneActivities.activities = activities
    this.setState({ bufferZoneActivities: newBufferZoneActivities })
  }

  deleteFromBufferZone = (activity) => {
    const newBufferZoneActivities = this.state.bufferZoneActivities
    const index = this.state.bufferZoneActivities.activities.indexOf(activity);
    const activitiesAfterDelete = this.state.bufferZoneActivities.activities;
    activitiesAfterDelete.splice(index, 1);
    newBufferZoneActivities.activities = activitiesAfterDelete
    this.setState({
      bufferZoneActivities: newBufferZoneActivities
    })
  }

  updateFilteredActivities = async () => {
    await this.getEvents()
    const filteredActivities = filterOffExistingOnes(
      this.state.activities,
      this.state.events
    )
    this.setState({
      filteredActivities
    })
  }

  render() {
    return (
      <StickyContainer className="App">
        <MuiThemeProvider>
          <div id="container">
            <div className="content">
              <NewEvent
                updateEvents={this.updateEvents}
              />
              <Notification store={this.props.store} />
              <ListEvents
                events={this.state.events}
                fetchEvents={this.getEvents}
                fetchedActivities={this.state.activities}
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

const AppDnD = DragDropContext(HTML5Backend)(App);
export default connect(null)(AppDnD)
