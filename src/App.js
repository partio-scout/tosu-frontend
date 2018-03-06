import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { StickyContainer, Sticky } from 'react-sticky';
import ListEvents from './components/ListEvents';
import NewEvent from './components/NewEvent';
import Appbar from './components/AppBar';
import activitiesData from './partio.json';
import { API_ROOT } from './api-config';
import eventService from './services/events';
import activityService from './services/activities';

class App extends Component {
  constructor() {
    super();
    this.state = {
      events: [{}],
      activities: activitiesData
    };
  }

  componentDidMount() {
    this.getEvents();
    this.getActivities();
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

  getActivities = async () => {
    try {
      const activities = await activityService.getAll();
      this.setState({
        activities
      });
    } catch (exception) {
      // Jos tietoja ei saada haettua, hae tiedot staattisesta JSON-tiedostosta

      this.setState({
        activities: activitiesData
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
              <h2 style={{ marginTop: 120 }}>Events</h2>
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
