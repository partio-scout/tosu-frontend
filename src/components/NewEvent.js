import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import DatePicker from "material-ui/DatePicker";
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
    eventDate: "",
    eventType: "",
    eventInformation: ""
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDate = (event, date) => {
    this.setState({
      eventDate: date
    })
  }

  handleTitle = (event) => {
    console.log(event)
    this.setState({
      eventTitle: event.target.value
    })
  }

  handleType = (event, index, type) => { 
    this.setState({ 
      eventType: type
     })
  };

  handleInformation = (event) => {
    this.setState({
      eventInformation: event.target.value
    })
  }

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
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
        >
          <DatePicker hintText="Valitse päivämäärä" onChange={this.handleDate} />
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
