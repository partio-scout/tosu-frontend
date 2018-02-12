import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import Checkbox from "material-ui/Checkbox";
import {
  TextValidator,
  ValidatorForm,
  DateValidator,
  TimeValidator,
  SelectValidator
} from "react-material-ui-form-validator";
import moment from "moment";

const errorStyle = {
  position: "absolute",
  marginBottom: "-22px",
  color: "red"
};

export default class NewEvent extends React.Component {
  state = {
    open: false,
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    checked: false,
    repeatCount: 1,
    repeatFrequency: 0,
    type: "",
    information: ""
  };

  componentWillMount() {
    ValidatorForm.addValidationRule("isLater", value => {
      if (value < this.state.startDate) {
        return false;
      } else if (
        this.state.startDate == this.state.endDate &&
        value < this.state.endTime
      ) {
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
    for (let i = 0; i < this.state.repeatCount; i++) {
      let startDate = this.state.startDate;
      let endDate = this.state.endDate;

      if (this.state.repeatFrequency === 1) {
        if (i !== 0) {
          startDate = moment(startDate).add(i, "days");
          endDate = moment(endDate).add(i, "days");
          console.log(startDate);
          console.log(endDate);
        }
      }

      if (this.state.repeatFrequency === 2) {
        if (i !== 0) {
          startDate = moment(startDate).add(i, "weeks");
          endDate = moment(endDate).add(i, "weeks");
          console.log(startDate);
          console.log(endDate);
        }
      }

      if (this.state.repeatFrequency === 3) {
        if (i !== 0) {
          startDate = moment(startDate).add(i * 14, "days");
          endDate = moment(endDate).add(i * 14, "days");
          console.log(startDate);
          console.log(endDate);
        }
      }

      if (this.state.repeatFrequency === 4) {
        if (i !== 0) {
          startDate = moment(startDate).add(i, "months");
          endDate = moment(endDate).add(i, "months");
          console.log(startDate);
          console.log(endDate);
        }
      }

      startDate = moment(startDate).format("YYYY-MM-DD");
      endDate = moment(endDate).format("YYYY-MM-DD");

      const data = {
        title: this.state.title,
        startDate: startDate,
        startTime: moment(this.state.startTime).format("HH:mm"),
        endDate: endDate,
        endTime: moment(this.state.endTime).format("HH:mm"),
        type: this.state.type,
        information: this.state.information
      };
      const d = moment(this.state.startDate);
      const h = moment(this.state.startTime);
      const startDateSimple = moment([
        d.year(),
        d.month(),
        d.date(),
        h.hours(),
        h.minutes()
      ]);

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
          console.log("Success:", response);
          this.handleClose();
        });
    }
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

  updateCheck() {
    this.setState(oldState => {
      if (oldState.checked) {
        this.setState({
          repeatCount: 1,
          repeatFrequency: 0
        });
      }
      return {
        checked: !oldState.checked
      };
    });
  }

  handleRepeatCount = event => {
    this.setState({
      repeatCount: event.target.value
    });
  };

  handleFrequency = (event, index, repeatFrequency) => {
    this.setState({
      repeatFrequency: repeatFrequency
    });
  };

  handleTitle = event => {
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
      <FlatButton
        key="cancelButton"
        label="Peruuta"
        primary={true}
        onClick={this.handleClose}
      />,
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
              validators={["required"]}
              errorMessages={["Päivämäärä vaaditaan"]}
            />
            <TimeValidator
              floatingLabelText="Tapahtuman alkamisaika"
              format="24hr"
              name="startTime"
              value={this.state.startTime}
              onChange={this.handleStartTime}
              validators={["required"]}
              errorMessages={["Aloitusaika vaaditaan"]}
            />
            <p>Lopetuspäivämäärä ja aika</p>
            <DateValidator
              type="date"
              name="endDate"
              value={this.state.endDate}
              onChange={this.handleEndDate}
              validators={["required", "isLater"]}
              errorMessages={[
                "Päivämäärä vaaditaan",
                "Päättymishetki ei voi olla aiemmin kuin alkamishetki!"
              ]}
            />
            <TimeValidator
              floatingLabelText="Tapahtuman loppumisaika"
              format="24hr"
              name="endTime"
              value={this.state.endTime}
              onChange={this.handleEndTime}
              validators={["required", "isLater"]}
              errorMessages={[
                "Loppumisaika vaaditaan",
                "Päättymishetki ei voi olla aiemmin kuin alkamishetki!"
              ]}
            />
            <br />
            <Checkbox
              label="Luo toistuva tapahtuma"
              checked={this.state.checked}
              onCheck={this.updateCheck.bind(this)}
            />
            <br />

            <TextValidator
              floatingLabelText="Toistuvien tapahtumien määrä"
              name="repeatCount"
              value={this.state.repeatCount}
              hintText="Toistuvien tapahtumien määrä"
              onChange={this.handleRepeatCount}
              disabled={!this.state.checked}
            />
            <br />
            <SelectValidator
              name="repeatFrequency"
              floatingLabelText="Toistumisväli"
              value={this.state.repeatFrequency}
              onChange={this.handleFrequency}
              disabled={!this.state.checked}
            >
              <MenuItem value={0} primaryText="Kerran" />
              <MenuItem value={1} primaryText="Päivittäin" />
              <MenuItem value={2} primaryText="Viikottain" />
              <MenuItem value={3} primaryText="Joka toinen viikko" />
              <MenuItem value={4} primaryText="Kuukausittain (esim. 12. pvä)" />
              <MenuItem
                value={5}
                primaryText="Kuukausittain (esim. 2. maanantai)"
              />
            </SelectValidator>
            <br />

            <TextValidator
              floatingLabelText="Tapahtuman nimi"
              name="nimi"
              value={this.state.title}
              hintText="Tapahtuman nimi"
              onChange={this.handleTitle}
              validators={["required"]}
              errorMessages={["Tapahtuman nimi vaaditaan"]}
              errorStyle={errorStyle}
            />
            <br />
            <SelectValidator
              name="tyyppi"
              floatingLabelText="Tapahtuman tyyppi"
              value={this.state.type}
              onChange={this.handleType}
              validators={["required"]}
              errorMessages={["Tapahtuman tyyppi vaaditaan"]}
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
