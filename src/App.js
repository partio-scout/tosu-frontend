import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { StickyContainer, Sticky } from 'react-sticky';
import ListEvents from './components/ListEvents';
import NewEvent from './components/NewEvent';
import Appbar from './components/AppBar';
import activitiesData from './partio.json';
import eventService from './services/events';
import activityService from './services/activities';
import activitiesArray from './utils/NormalizeActivitiesData';

class App extends Component {
  constructor() {
    super();
    this.state = {
      events: [{}],
      activities: activitiesArray(activitiesData),
      bufferZoneActivities: [{}]
    };
  }

  componentDidMount() {
    this.getEvents();
    this.getActivities();
    // this.getBufferZoneActivities()
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

  render() {
    return (
      <StickyContainer className="App">
        <MuiThemeProvider>
          <div id="container">
            <div className="content">
              <NewEvent updateEvents={this.updateEvents} />
              <ListEvents
                events={this.state.events}
                fetchEvents={this.getEvents}
                fetchedActivities={this.state.activities}
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
