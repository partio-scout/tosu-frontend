import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import eventService from '../services/events';
import eventgroupService from '../services/eventgroups';
import FrequentEventsHandler from '../utils/FrequentEventsHandler';
import EventForm from './EventForm';

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

  handleCloseAndSend = async () => {
    this.setState({
      open: false
    });
    console.log(this.state.startTime)
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

      await this.sendEventPostRequest(data)
      if (!this.state.checked) {
        this.handleClose();
        this.props.updateEvents();
      }
    } else {
      // Send POST first to create new GroupId and then use id from response to create group of events. ß
      let response = await this.sendGroupIdPostRequest()

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
        console.log(newEndDate, ' fre ', this.state.repeatFrequency)
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

        try {
          await this.sendEventPostRequest(data)
          if (i === this.state.repeatCount - 1) {
            this.handleClose();
            this.props.updateEvents();
          }
        } catch (exception) {
          console.error('Error in event POST:', exception);
        }
      }

    }
    this.setState({
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

  sendGroupIdPostRequest = async () => {
    try {
      const groupId = await eventgroupService.create();
      return groupId;
    } catch (exception) {
      console.error('Error in event POST:', exception);
    }
  };

  sendEventPostRequest = async data => {
    try {
      await eventService.create(data);
    } catch (exception) {
      console.error('Error in event POST:', exception);
    }
  };

  update = (
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    checked,
    repeatCount,
    repeatFrequency,
    type,
    information
  ) => {
    this.setState({
      title: title,
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      checked: checked,
      repeatCount: repeatCount,
      repeatFrequency: repeatFrequency,
      type: type,
      information: information
    });
  };

  render() {
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
          <EventForm 
            submitFunction={this.handleCloseAndSend.bind(this)} 
            close={this.handleClose.bind(this)} 
            update={this.update.bind(this)} 
            data={this.state} 
          />
        </Dialog>
      </div>
    );
  }
}
