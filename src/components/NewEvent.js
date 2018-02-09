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
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    type: "",
    information: ""
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
      title: this.state.title,
      startDate: this.state.startDate,
      startTime: this.state.startTime,
      endDate: this.state.endDate,
      endTime: this.state.endTime,
      type: this.state.type,
      information: this.state.information
    };

    console.log(data);

    fetch(
      "https://cors-anywhere.herokuapp.com/https://suunnittelu.partio-ohjelma.fi:3001/events",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }
    )
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(response => console.log("Success:", response));
  };

  handleStartDate = event => {
    this.setState({
      startDate: event.target.value
    });
  };

  handleStartTime = event => {
    this.setState({
      startTime: event.target.value
    });
  };

  handleEndDate = event => {
    this.setState({
      endDate: event.target.value
    });
  };

  handleEndTime = event => {
    this.setState({
      endTime: event.target.value
    });
  };

  handleTitle = event => {
    console.log(event);
    this.setState({
      title: event.target.value
    });
  };

  handleType = (event, index, type) => {
    this.setState({
      type: type
    });
  };

  handleInformation = event => {
    this.setState({
      information: event.target.value
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
            value={this.state.type}
            onChange={this.handleType}
          >
            <MenuItem value={"kokous"} primaryText="Kokous" />
            <MenuItem value={"leiri"} primaryText="Leiri" />
            <MenuItem value={"retki"} primaryText="Retki" />
            <MenuItem value={"vaellus"} primaryText="Vaellus" />
            <MenuItem value={"muu tapahtuma"} primaryText="Muu tapahtuma" />
          </SelectField>
          <br />
          <TextField
            hintText="Lisätietoja"
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
