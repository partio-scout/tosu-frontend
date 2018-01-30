import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */

export default class NewEvent extends React.Component {
  state = {
    open: false,
    eventTitle: "",
    eventStartDate: "",
    eventStartTime: "",
    eventEndDate: "",
    eventEndTime: "",
    eventType: "",
    eventInformation: ""
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleCloseAndSend = () => {
    this.setState({ open: false });

    const data = {
      eventTitle: this.state.eventTitle,
      eventStartDate: this.state.eventStartDate,
      eventStartTime: this.state.eventStartTime,
      eventEndDate: this.state.eventEndDate,
      eventEndTime: this.state.eventEndTime,
      eventType: this.state.eventType,
      eventInformation: this.state.eventInformation,

      //TODO kirjautuneen käyttäjän yhdistäminen eventiin"
      organizerName: "Partio",
      organizerId: 2
    };

    fetch("http://localhost:3001/events", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(response => console.log("Success:", response));
  };

  handleStartDate = event => {
    this.setState({
      eventStartDate: event.target.value
    });
  };

  handleStartTime = event => {
    this.setState({
      eventStartTime: event.target.value
    });
  };

  handleEndDate = event => {
    this.setState({
      eventEndDate: event.target.value
    });
  };

  handleEndTime = event => {
    this.setState({
      eventEndTime: event.target.value
    });
  };

  handleTitle = event => {
    console.log(event);
    this.setState({
      eventTitle: event.target.value
    });
  };

  handleType = (event, index, type) => {
    this.setState({
      eventType: type
    });
  };

  handleInformation = event => {
    this.setState({
      eventInformation: event.target.value
    });
  };

  render() {
    const actions = [
      <FlatButton label="Peruuta" primary={true} onClick={this.handleClose} />,
      <FlatButton
        label="Tallenna"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleCloseAndSend}
      />
    ];

    return (
      <div>
        <RaisedButton label="Uusi tapahtuma" onClick={this.handleOpen} />
        <Dialog
          title="Luo uusi tapahtuma"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <p>Aloitus päivämäärä ja aika</p>
          <TextField
            type="date"
            name="startDate"
            value={this.state.eventStartDate}
            onChange={this.handleStartDate}
          />
          <TextField
            type="time"
            name="startTime"
            value={this.state.time}
            onChange={this.handleStartTime}
          />
          <p>Lopetus päivämäärä ja aika</p>
          <TextField
            type="date"
            name="endDate"
            value={this.state.eventEndDate}
            onChange={this.handleEndDate}
          />
          <TextField
            type="time"
            name="endTime"
            value={this.state.eventEndTime}
            onChange={this.handleEndTime}
          />

          <TextField hintText="Tapahtuman nimi" onChange={this.handleTitle} />
          <br />
          <SelectField
            floatingLabelText="Tapahtuman tyyppi"
            value={this.state.eventType}
            onChange={this.handleType}
          >
            <MenuItem value={"kokous"} primaryText="Kokous" />
            <MenuItem value={"leiri"} primaryText="Leiri" />
            <MenuItem value={"retki"} primaryText="Retki" />
            <MenuItem value={"vaellus"} primaryText="Vaellus" />
            <MenuItem value={"muu tapahtuma"} primaryText="Muu tapahtuma" />
          </SelectField>
          <TextField
            hintText="Message Field"
            floatingLabelText="Lisätietoja"
            onChange={this.handleInformation}
            multiLine={true}
            rows={2}
          />
          <br />
        </Dialog>
      </div>
    );
  }
}
