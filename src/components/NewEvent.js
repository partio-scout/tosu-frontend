import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import { API_ROOT } from '../api-config';
import {
  TextValidator,
  ValidatorForm,
  DateValidator,
  TimeValidator,
  SelectValidator
} from 'react-material-ui-form-validator';
import moment from 'moment';
import FrequentEventsHandler from '../utils/FrequentEventsHandler';
import EventForm from './EventForm';

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
    fetch(`${API_ROOT}/eventgroup`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    )
      .then(res => res.json())
      .catch(error => console.error('Error in groupId POST:', error));

  sendEventPostRequest = data =>
  fetch(`${API_ROOT}/events`,
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
          <EventForm />
        </Dialog>
      </div>
    );
  }
}
