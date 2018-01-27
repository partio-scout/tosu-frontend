import React, { Component } from 'react';
import './App.css';
import ListEvents from './components/ListEvents'

class App extends Component {
  constructor() {
    super()
    this.state = {
      events: [{}]
    }
    this.getEvents = this.getEvents.bind(this);
  }  

  getEvents = () => {
    fetch('http://localhost:3001/events')
    .then(res => res.json())
    .then(data => this.setState({ events: data }));
  }

  componentWillMount() {
    this.getEvents();
  }

  render() {

    return (
      <div className="App">
        Ohtupartio
        <ListEvents events={this.state.events}/>>
      </div>
    );
  }
}

export default App;
