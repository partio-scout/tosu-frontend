import React, { Component } from "react";
import ListEvents from "./components/ListEvents";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import NewEvent from "./components/NewEvent";
import Activities from "./components/Activities";
import activitiesData from "./partio.json";
import Appbar from "./components/AppBar"

class App extends Component {
  constructor() {
    super();
    this.state = {
      events: [{}]
    };
    this.getEvents = this.getEvents.bind(this);
  }

  getEvents = () => {
    fetch("http://localhost:3001/events")
      .then(res => res.json())
      .then(data => this.setState({ events: data }));
  };

  componentWillMount() {
    this.getEvents();
  }

  render() {
    return (
        <div className="App">
          <MuiThemeProvider>
            <Appbar/>
            <div className="content">
              <h2>Events</h2>
              <NewEvent />
              <ListEvents events={this.state.events} />
              <h2>Activities</h2>
              <Activities data={activitiesData} />
            </div>
            </MuiThemeProvider>
        </div>
      
    );
  }
}

export default App;
