import React from 'react';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import {
  TextValidator,
  ValidatorForm,
  DateValidator,
  TimeValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import moment from 'moment';
import FlatButton from 'material-ui/FlatButton';

const errorStyle = {
  position: 'absolute',
  marginBottom: '-22px',
  color: 'red'
};

export default class EventForm extends React.Component {
  constructor(props) {
    super(props);
    const event = this.props.data
    this.state = {
      title: event.title,
      startDate: event.startDate,
      startTime: event.startTime,
      endDate: event.endDate,
      endTime: event.endTime,
      checked: false,
      repeatCount: 1,
      repeatFrequency: 0,
      type: event.type,
      information: event.information
    };
  }



  componentDidMount() {
    ValidatorForm.addValidationRule('dateIsLater', (value) => {
      if (value.setHours(0, 0, 0, 0) < this.state.startDate.setHours(0, 0, 0, 0)) {
        return false;
      }
      return true;
    })
    ValidatorForm.addValidationRule('timeIsLater', (value) => {
      if (this.state.startDate.setHours(0, 0, 0, 0) === this.state.endDate.setHours(0, 0, 0, 0) && moment(value).format("HH:mm") < moment(this.state.startTime).format("HH:mm")) {
        return false;
      }
      return true;
    })
  }

  handleNewEventFormChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleStartDate = (event, date) => {
    this.setState({
      startDate: date,
      endDate: date
    });
  };

  handleStartTime = (event, date) => {
    this.setState({
      startTime: date,
      endTime: new Date(moment(date).add(1, 'h'))
    });
  };

  handleEndDate = (event, date) => {
    this.setState({
      endDate: new Date(date)
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
      repeatFrequency
    });
  };

  handleTitle = event => {
    this.setState({
      title: event.target.value
    });
  };

  handleType = (event, index, type) => {
    this.setState({
      type
    });
  };

  handleInformation = event => {
    this.setState({
      information: event.target.value
    });
  };

  send = async () => {
    await this.props.update(this.state.title, this.state.startDate, this.state.startTime,
      this.state.endDate, this.state.endTime, this.state.checked,
      this.state.repeatCount, this.state.repeatFrequency,
      this.state.type, this.state.information)
    this.props.submitFunction()
  }

  render() {
    const minDate = moment()
      .utcOffset(120)
      .toDate()
    const actions = [
      <FlatButton
        key="cancelButton"
        label="Peruuta"
        primary
        onClick={this.props.close}
      />,
      <FlatButton
        key="submitButton"
        type="submit"
        label="Tallenna"
        primary
        keyboardFocused
      />
    ];
    return (
      <ValidatorForm
        ref={() => 'form'}
        onSubmit={this.send}
        onError={errors => console.log(errors)}
      >
        <p>Aloituspäivämäärä ja aika</p>
        <DateValidator
          name="startDate"
          autoOk
          minDate={minDate}
          cancelLabel="Peruuta"
          value={this.state.startDate === '' ? undefined : this.state.startDate}
          onChange={this.handleStartDate}
          validators={['required']}
          errorMessages={['Päivämäärä vaaditaan']}
        />
        <TimeValidator
          floatingLabelText="Tapahtuman alkamisaika"
          format="24hr"
          name="startTime"
          cancelLabel="Peruuta"
          autoOk
          value={this.state.startTime === '' ? undefined : this.state.startTime}
          onChange={this.handleStartTime}
          validators={['required']}
          errorMessages={['Aloitusaika vaaditaan']}
        />
        <p>Lopetuspäivämäärä ja aika</p>
        <DateValidator
          name="endDate"
          autoOk
          minDate={minDate}
          cancelLabel="Peruuta"
          value={this.state.endDate === '' ? undefined : this.state.endDate}
          onChange={this.handleEndDate}
          validators={['dateIsLater']}
          errorMessages={[
            'Päättymishetki ei voi olla aiemmin kuin alkamishetki!'
          ]}
        />
        <TimeValidator
          floatingLabelText="Tapahtuman loppumisaika"
          format="24hr"
          name="endTime"
          cancelLabel="Peruuta"
          autoOk
          value={this.state.endTime === '' ? undefined : this.state.endTime}
          onChange={this.handleEndTime}
          validators={['timeIsLater']}
          errorMessages={[
            'Päättymishetki ei voi olla aiemmin kuin alkamishetki!'
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
          onChange={this.handleNewEventFormChange}
          disabled={!this.state.checked}
          validators={['maxNumber:55']}
          errorMessages={[
            'Voit luoda max. 55 toistuvaa tapahtumaa kerrallaan'
          ]}
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
          name="title"
          value={this.state.title}
          hintText="Tapahtuman nimi"
          onChange={this.handleNewEventFormChange}
          validators={['required']}
          errorMessages={['Tapahtuman nimi vaaditaan']}
          errorStyle={errorStyle}
        />
        <br />
        <SelectValidator
          name="type"
          floatingLabelText="Tapahtuman tyyppi"
          value={this.state.type}
          onChange={this.handleType}
          validators={['required']}
          errorMessages={['Tapahtuman tyyppi vaaditaan']}
        >
          <MenuItem value="kokous" primaryText="Kokous" />
          <MenuItem value="leiri" primaryText="Leiri" />
          <MenuItem value="retki" primaryText="Retki" />
          <MenuItem value="vaellus" primaryText="Vaellus" />
          <MenuItem value="muu tapahtuma" primaryText="Muu tapahtuma" />
        </SelectValidator>
        <br />

        <TextField
          hintText="Lisätietoja"
          floatingLabelText="Lisätietoja"
          name="information"
          value={this.state.information}
          onChange={this.handleNewEventFormChange}
          multiLine
          rows={2}
        />
        <br />
        {actions}
      </ValidatorForm>
    )
  }
}
