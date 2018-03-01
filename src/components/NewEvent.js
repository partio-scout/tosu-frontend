import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
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
import FrequentEventsHandler from '../utils/FrequentEventsHandler';

const errorStyle = {
  position: 'absolute',
  marginBottom: '-22px',
  color: 'red'
};

export default class NewEvent extends React.Component {
  state = {
    open: false,
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    checked: false,
    repeatCount: 1,
    repeatFrequency: 0,
    type: '',
    information: ''
  };

  componentWillMount() {
    ValidatorForm.addValidationRule('dateIsLater', (value) => {
      if (value.setHours(0, 0, 0, 0) < this.state.startDate.setHours(0, 0, 0, 0)) {
        return false;
      }
      return true;
    })
    ValidatorForm.addValidationRule('timeIsLater', (value) => {
      if (this.state.startDate.setHours(0, 0, 0, 0) == this.state.endDate.setHours(0, 0, 0, 0) && moment(value).format("HH:mm") < moment(this.state.startTime).format("HH:mm")) {
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
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      checked: false,
      repeatCount: 1,
      repeatFrequency: 0,
      type: '',
      information: ''
    });
  };

  sendGroupIdPostRequest = () =>
    fetch(
      'https://cors-anywhere.herokuapp.com/https://suunnittelu.partio-ohjelma.fi:3001/eventgroup',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    )
      .then(res => res.json())
      .catch(error => console.error('Error in groupId POST:', error));

  sendEventPostRequest = data =>
    fetch(
      'https://cors-anywhere.herokuapp.com/https://suunnittelu.partio-ohjelma.fi:3001/events',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    )
      .then(res => res.json())
      .catch(error => console.error('Error in event POST:', error));

  handleCloseAndSend = () => {
    this.setState({
      open: false
    });

    const { startDate, endDate } = this.state;

    if (!this.state.checked) {
      const data = {
        title: this.state.title,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        startTime: moment(this.state.startTime).format('HH:mm'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
        endTime: moment(this.state.endTime).format('HH:mm'),
        type: this.state.type,
        information: this.state.information
      };

      console.log('Data', data);

      this.sendEventPostRequest(data).then(() => {
        if (!this.state.checked) {
          this.handleClose();
          this.props.updateEvents();
        }
      });
    } else {
      // Send POST first to create new GroupId and then use id from response to create group of events. ß
      this.sendGroupIdPostRequest().then(response => {
        for (let i = 0; i < this.state.repeatCount; i += 1) {
          const newStartDate = FrequentEventsHandler(
            this.state.startDate,
            this.state.repeatFrequency,
            i
          ).format('YYYY-MM-DD');

          const newEndDate = FrequentEventsHandler(
            this.state.endDate,
            this.state.repeatFrequency,
            i
          ).format('YYYY-MM-DD');

          const data = {
            title: this.state.title,
            startDate: newStartDate,
            startTime: moment(this.state.startTime).format('HH:mm'),
            endDate: newEndDate,
            endTime: moment(this.state.endTime).format('HH:mm'),
            type: this.state.type,
            information: this.state.information,
            groupId: response.groupId
          };

          this.sendEventPostRequest(data).then(() => {
            if (i === this.state.repeatCount - 1) {
              this.handleClose();
              this.props.updateEvents();
            }
          });
        }
      });
    }
  };

  handleNewEventFormChange = event => {
    this.setState({ [event.target.name]: event.target.value });
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

  render() {
    const actions = [
      <FlatButton
        key="cancelButton"
        label="Peruuta"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        key="submitButton"
        type="submit"
        label="Tallenna"
        primary
        keyboardFocused
      />
    ];
    const minDate = moment()
      .utcOffset(120)
      .toDate()
    return (
      <div>
        <RaisedButton label="Uusi tapahtuma" onClick={this.handleOpen} />
        <Dialog
          title="Luo uusi tapahtuma"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent
        >
          <ValidatorForm
            ref={() => 'form'}
            onSubmit={this.handleCloseAndSend}
            onError={errors => console.log(errors)}
          >
            <p>Aloituspäivämäärä ja aika</p>
            <DateValidator
              type="date"
              name="startDate"
              mode="landscape"
              autoOk={true}
              minDate={minDate}
              cancelLabel="Peruuta"
              value={this.state.startDate}
              onChange={this.handleStartDate}
              validators={['required']}
              errorMessages={['Päivämäärä vaaditaan']}
            />
            <TimeValidator
              floatingLabelText="Tapahtuman alkamisaika"
              format="24hr"
              name="startTime"
              cancelLabel="Peruuta"
              autoOk={true}
              value={this.state.startTime}
              onChange={this.handleStartTime}
              validators={['required']}
              errorMessages={['Aloitusaika vaaditaan']}
            />
            <p>Lopetuspäivämäärä ja aika</p>
            <DateValidator
              type="date"
              name="endDate"
              mode="landscape"
              autoOk={true}
              minDate={minDate}
              cancelLabel="Peruuta"
              value={this.state.endDate}
              onChange={this.handleEndDate}
              validators={['required', 'dateIsLater']}
              errorMessages={[
                'Päivämäärä vaaditaan',
                'Päättymishetki ei voi olla aiemmin kuin alkamishetki!'
              ]}
            />
            <TimeValidator
              floatingLabelText="Tapahtuman loppumisaika"
              format="24hr"
              name="endTime"
              cancelLabel="Peruuta"
              autoOk={true}
              value={this.state.endTime}
              onChange={this.handleEndTime}
              validators={['required', 'timeIsLater']}
              errorMessages={[
                'Loppumisaika vaaditaan',
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
              onChange={this.handleNewEventFormChange}
              multiLine
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
