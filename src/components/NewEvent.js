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
    value: 1,
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

  handleChange = (event, index, value) => this.setState({ value });

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
          <DatePicker hintText="Valitse päivämäärä" />
          <TextField hintText="Tapahtuman nimi" />
          <br />
          <SelectField
            floatingLabelText="Tapahtuman tyyppi"
            value={this.state.value}
            onChange={this.handleChange}
          >
            <MenuItem value={1} primaryText="Kokous" />
            <MenuItem value={2} primaryText="Leiri" />
            <MenuItem value={3} primaryText="Retki" />
            <MenuItem value={4} primaryText="Vaellus" />
            <MenuItem value={5} primaryText="Muu" />
          </SelectField>
        </Dialog>
      </div>
    );
  }
}
