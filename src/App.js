import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { StickyContainer, Sticky } from 'react-sticky';
import ListEvents from './components/ListEvents';
import NewEvent from './components/NewEvent';
import Activities from './components/Activities';
import Appbar from './components/AppBar';
import activitiesData from './partio.json';
import { API_ROOT } from './api-config';

class App extends Component {
  constructor() {
    super();
    this.state = {
      events: [{}],
      activities: activitiesData
    };
    this.getEvents = this.getEvents.bind(this);
    this.getActivities = this.getActivities.bind(this);
  }

  componentDidMount() {
    this.getEvents();
    this.getActivities();
  }
  getEvents = () => {
    fetch(`${API_ROOT}/events`)
      .then(res => res.json())
      .then(data => this.setState({ events: data }))
      .catch(error => {
        console.log(error);
        this.setState({
          events: [
            {
              title: 'Backend not working, fake data to prevent error',
              startDate: '2018-02-06',
              startTime: '11:43',
              endDate: '2018-02-09',
              endTime: '13:43',
              type: 'kokous',
              information: 'oooooo',
              id: '1'
            }
          ]
        });
      });
  };

  getActivities = () => {
    fetch(`${API_ROOT}/pofdata`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          activities: data
        });
      })
      .catch(error => {
        console.log('Error: ', error);
        // Jos tietoja ei saada haettua, hae tiedot staattisesta JSON-tiedostosta
        this.setState({
          activities: activitiesData
        });
      });
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
              <h2>Activities</h2>
              <Activities fetchedActivities={this.state.activities} />
            </div>
            <Sticky>
              {({ style }) => (
                <header style={style}>
                  <Appbar activities={this.state.activities}
                  events={this.state.events} />
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
