import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ListEvents from './components/ListEvents';
import NewEvent from './components/NewEvent';
import Activities from './components/Activities';
import Appbar from './components/AppBar';
import activitiesData from './partio.json';

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
    fetch(
      'https://cors-anywhere.herokuapp.com/https://suunnittelu.partio-ohjelma.fi:3001/events'
    )
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
    fetch(
      'https://cors-anywhere.herokuapp.com/https://suunnittelu.partio-ohjelma.fi:3001/pofdata'
    )
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
      <div className="App">
        <MuiThemeProvider>
          <div id="container">
            <Appbar activities={this.state.activities}/>
            <div className="content">
              <h2>Events</h2>
              <NewEvent updateEvents={this.updateEvents} />
              <ListEvents events={this.state.events} fetchEvents={this.getEvents}
              fetchedActivities={this.state.activities} />
              <h2>Activities</h2>
              <Activities fetchedActivities={this.state.activities} />
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
