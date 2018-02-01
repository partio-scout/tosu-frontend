import React, { Component } from "react";
import "./App.css";
import ListEvents from "./components/ListEvents";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import NewEvent from "./components/NewEvent";
import Activities from "./components/Activities"

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
      <MuiThemeProvider>
        <div className="App">
          <h1>Ohtupartio</h1>
          <NewEvent />
          <ListEvents events={this.state.events} />
          <Activities />
          
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
