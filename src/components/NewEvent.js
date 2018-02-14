import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import { TextValidator, ValidatorForm, DateValidator, TimeValidator, SelectValidator } from 'react-material-ui-form-validator';
import moment from "moment"

const errorStyle = {
  position: 'absolute',
  marginBottom: '-22px',
  color: 'red',
};

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

  componentWillMount() {
    ValidatorForm.addValidationRule('dateIsLater', (value) => {
      if (value.setHours(0,0,0,0) < this.state.startDate.setHours(0,0,0,0)) {
        return false;
      } 
      return true;
    });
    ValidatorForm.addValidationRule('timeIsLater', (value) => {
      if(this.state.startDate.setHours(0,0,0,0) == this.state.endDate.setHours(0,0,0,0) && moment(value).format("HH:mm") < moment(this.state.startTime).format("HH:mm")) {
        console.log(this.state.startDate)
        console.log(this.state.endDate)
        console.log(moment(value).format("HH:mm"))
        console.log(moment(this.state.startTime).format("HH:mm"))
        return false;
      }
      return true;
    });
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({
      open: false,
      title: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      type: "",
      information: ""
    });
  };

  handleCloseAndSend = () => {
    this.setState({
      open: false
    });

    const data = {
      title: this.state.title,
      startDate: moment(this.state.startDate).format("YYYY-MM-DD"),
      startTime: moment(this.state.startTime).format("HH:mm"),
      endDate: moment(this.state.endDate).format("YYYY-MM-DD"),
      endTime: moment(this.state.endTime).format("HH:mm"),
      type: this.state.type,
      information: this.state.information
    };
    const d = moment(this.state.startDate)
    const h = moment(this.state.startTime)
    const startDateSimple = moment([d.year(), d.month(), d.date(), h.hours(), h.minutes()])
    console.log(startDateSimple)
    console.log(moment(this.state.startDate).format("YYYY-MM-DD"))
    console.log(moment(this.state.startTime).format("HH:mm"))
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
      .then(response => {
        console.log("Success:", response) 
        this.props.updateEvents()
      });
  };

  handleStartDate = (event, date) => {
    this.setState({
      startDate: date
    });
  };

  handleStartTime = (event, date) => {
    this.setState({
      startTime: date
    });
  };

  handleEndDate = (event, date) => {
    this.setState({
      endDate: date
    });
  };

  handleEndTime = (event, date) => {
    this.setState({
      endTime: date
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
      <FlatButton key="cancelButton" label="Peruuta" primary={true} onClick={this.handleClose} />,
      <FlatButton
        key="submitButton"
        type="submit"
        label="Tallenna"
        primary={true}
        keyboardFocused={true}
      />
    ];

    return (
      <div>
        <RaisedButton label="Uusi tapahtuma" onClick={this.handleOpen} />
        <Dialog
          title="Luo uusi tapahtuma"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <ValidatorForm
            ref="form"
            onSubmit={this.handleCloseAndSend}
            onError={errors => console.log(errors)}
          >
            <p>Aloituspäivämäärä ja aika</p>
            <DateValidator
              type="date"
              name="startDate"
              value={this.state.startDate}
              onChange={this.handleStartDate}
              validators={['required']}
              errorMessages={['Päivämäärä vaaditaan']}
            />
            <TimeValidator
              floatingLabelText="Tapahtuman alkamisaika"
              format="24hr"
              name="startTime"
              value={this.state.startTime}
              onChange={this.handleStartTime}
              validators={['required']}
              errorMessages={['Aloitusaika vaaditaan']}
            />
            <p>Lopetuspäivämäärä ja aika</p>
            <DateValidator
              type="date"
              name="endDate"
              value={this.state.endDate}
              onChange={this.handleEndDate}
              validators={['required', 'dateIsLater']}
              errorMessages={['Päivämäärä vaaditaan', 'Päättymishetki ei voi olla aiemmin kuin alkamishetki!']}
            />
            <TimeValidator
              floatingLabelText="Tapahtuman loppumisaika"
              format="24hr"
              name="endTime"
              value={this.state.endTime}
              onChange={this.handleEndTime}
              validators={['required', 'timeIsLater']}
              errorMessages={['Loppumisaika vaaditaan', 'Päättymishetki ei voi olla aiemmin kuin alkamishetki!']}
            />
            <br />
            <TextValidator
              floatingLabelText="Tapahtuman nimi"
              name="nimi"
              value={this.state.title}
              hintText="Tapahtuman nimi"
              onChange={this.handleTitle}
              validators={['required']}
              errorMessages={['Tapahtuman nimi vaaditaan']}
              errorStyle={errorStyle}
            />
            <br />
            <SelectValidator
              name="tyyppi"
              floatingLabelText="Tapahtuman tyyppi"
              value={this.state.type}
              onChange={this.handleType}
              validators={['required']}
              errorMessages={['Tapahtuman tyyppi vaaditaan']}
            >

              <MenuItem value={"kokous"} primaryText="Kokous" />
              <MenuItem value={"leiri"} primaryText="Leiri" />
              <MenuItem value={"retki"} primaryText="Retki" />
              <MenuItem value={"vaellus"} primaryText="Vaellus" />
              <MenuItem value={"muu tapahtuma"} primaryText="Muu tapahtuma" />
            </SelectValidator>
            <br />

            <TextField
              hintText="Lisätietoja"
              floatingLabelText="Lisätietoja"
              onChange={this.handleInformation}
              multiLine={true}
              rows={2}
            />
            <br />
            {actions}
          </ValidatorForm>
        </Dialog>
      </div>
    );
  }
}
