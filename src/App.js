import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { StickyContainer, Sticky } from 'react-sticky';
import ListEvents from './components/ListEvents';
import NewEvent from './components/NewEvent';
import Appbar from './components/AppBar';
import activitiesData from './partio.json';
import eventService from './services/events';
import activityService from './services/activities';
import filterOffExistingOnes from './functions/searchBarFiltering';
import activitiesArray from './utils/NormalizeActivitiesData';

class App extends Component {
  constructor() {
    super();
    this.state = {
      events: [{}],
      bufferZoneActivities: [],
      activities: activitiesArray(activitiesData),
      notification: "",
      filteredActivities: []
    };
  }

  componentDidMount() {
    this.getEvents();

    const update = () => {
      this.getActivities()
      this.updateFilteredActivities()
      this.getBufferZoneActivities()
    };

    update();
  }

  getEvents = async () => {
    try {
      const events = await eventService.getAll();
      this.setState({
        events
      });
    } catch (exception) {
      this.setState({
        events: []
      });
    }
  };

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
      const activities = await activityService.getAll();
      this.setState({
        activities: activitiesArray(activities)

      });
    } catch (exception) {
      // Jos tietoja ei saada haettua, hae tiedot staattisesta JSON-tiedostosta

      this.setState({
        activities: activitiesArray(activitiesData)
      });
    }
  };

  setNotification = (notification, time = 5) => {
    this.setState({ notification: notification })
    setTimeout(() => {
      this.setState({notification: ""})
    }, time * 1000);
  }

  updateEvents = () => {
    this.getEvents();
  };

  updateBufferZoneActivities = (activities) => {
    this.setState({ bufferZoneActivities: activities })
  }

  updateFilteredActivities = async () => {
    await this.getEvents();
    const filteredActivities = filterOffExistingOnes(
      this.state.activities,
      this.state.events
    );
    this.setState({
      filteredActivities
    });
  };
  

  render() {
    return (
      <StickyContainer className="App">
        <MuiThemeProvider>
          <div id="container">
            <div className="content">
              <NewEvent
                updateEvents={this.updateEvents} 
                setNotification={this.setNotification}
              />
              <h2> {this.state.notification.toString()} </h2>
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
                    filteredActivities={this.state.filteredActivities}
                    activities={this.state.activities}
                    events={this.state.events}
                    bufferZoneActivities={this.state.bufferZoneActivities}
                    updateFilteredActivities={this.updateFilteredActivities}
                    bufferZoneUpdater={this.updateBufferZoneActivities}
                  />
                </header>
              )}
            </Sticky>
          </div>
        </MuiThemeProvider>
      </StickyContainer>
    );
  }
}

export default App;
