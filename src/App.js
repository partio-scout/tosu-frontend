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
      filteredActivities: [],
      notification: ""
    };
  }

  componentDidMount() {
    this.getEvents();

    const update = async () => {
      await this.getActivities();
      this.updateFilteredActivities();
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
      this.setState({bufferZoneActivities: [{"jeejee": 0}]})
      console.error(exception)
    }
  }

  getActivities = async () => {
    try {
      const activities = await activityService.getAll();
      const normalizedActivities = activitiesArray(activities);
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

  updateEvents = () => {
    this.getEvents();
  };


  setNotification = (notification, time = 5) => {
    this.setState({notification: notification})
    setTimeout(() => {
      this.setState({notification: ""})
    }, time * 1000);
  }

  updateFilteredActivities = async () => {
    await this.getEvents();

    const filteredActivities = filterOffExistingOnes(
      this.state.activities,
      this.state.events,
      undefined//buffer here
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
              <h2 style={{ marginTop: 120 }}>Events</h2>
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
                    activities={this.state.activities}
                    events={this.state.events}
                    bufferactivities={this.state.bufferZoneActivities}
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
