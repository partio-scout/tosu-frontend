import React, { Component } from "react";
import ListEvents from "./components/ListEvents";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import NewEvent from "./components/NewEvent";
import Activities from "./components/Activities";
import activitiesData from "./partio.json";
import Appbar from "./components/AppBar";

class App extends Component {
  constructor() {
    super();
    this.state = {
      events: [{}]
    };
    this.getEvents = this.getEvents.bind(this);
  }

  getEvents = () => {
    fetch(
      "https://cors-anywhere.herokuapp.com/https://suunnittelu.partio-ohjelma.fi:3001/events"
    )
      .then(res => res.json())
      .then(data => this.setState({ events: data }))
      .catch(error => {
        console.log(error);
        this.setState({
          events: [{
            title: "Backend not working, fake data to prevent error",
            startDate: "2018-02-06",
            startTime: "11:43",
            endDate: "2018-02-09",
            endTime: "13:43",
            type: "kokous",
            information: "oooooo",
            id: "1"
          }]
        });
      });
  };

  componentWillMount() {
    this.getEvents();
  }

  updateEvents = () => {
    this.getEvents();
  };

  render() {
    return (
      <div className="App">
        <MuiThemeProvider>
          <div id="container">
            <Appbar />
            <div className="content">
              <h2>Events</h2>
              <NewEvent updateEvents={this.updateEvents} />
              <ListEvents events={this.state.events} />
              <h2>Activities</h2>
              <Activities data={activitiesData} />
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
