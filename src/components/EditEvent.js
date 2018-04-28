import React from 'react'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
//import eventgroupService from '../services/eventgroups';
import moment from 'moment'
import EventForm from './EventForm'
import { notify } from '../reducers/notificationReducer'
import { connect } from 'react-redux'
import { editEvent } from '../reducers/eventReducer'
import { bufferZoneInitialization } from '../reducers/bufferZoneReducer'

class EditEvent extends React.Component {
  constructor(props) {
    super(props)
    const event = this.props.data
    const newStartTime = moment(
      `${event.startDate} ${event.startTime}`,
      'YYYY-MM-DD HH:mm'
    )
    const newEndTime = moment(
      `${event.endDate} ${event.endTime}`,
      'YYYY-MM-DD HH:mm'
    )
    this.state = {
      open: false,
      title: event.title,
      startDate: new Date(event.startDate),
      startTime: newStartTime.toDate(),
      endDate: new Date(event.endDate),
      endTime: newEndTime.toDate(),
      checked: false,
      repeatCount: 1,
      repeatFrequency: 0,
      type: event.type,
      information: event.information
    }
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({
      open: false
      /* title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      checked: false,
      repeatCount: 1,
      repeatFrequency: 0,
      type: '',
      information: '' */
    })
  }

  handleCloseAndSend = async () => {
    const moddedEvent = {
      id: this.props.data.id,
      title: this.state.title,
      startDate: moment(this.state.startDate).format('YYYY-MM-DD'),
      startTime: moment(this.state.startTime).format('HH:mm'),
      endDate: moment(this.state.endDate).format('YYYY-MM-DD'),
      endTime: moment(this.state.endTime).format('HH:mm'),
      type: this.state.type,
      information: this.state.information
    }
    try {
      this.props.editEvent(moddedEvent)
      this.props.bufferZoneInitialization(0)
      // await eventService.edit(data);
      this.props.source()
      this.setState({ open: false })
      this.props.notify('Tapahtuman muokkaus onnistui!', 'success')
    } catch (exception) {
      console.error('Error in event PUT:', exception)
      this.props.notify('Tapahtuman muokkaus epäonnistui!')
    }
  }

  /*
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
  */

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
    })
  }

  render() {
    const disabled = this.state.endTime < new Date()
    return (
      <div>
        <RaisedButton
          label="Muokkaa"
          onClick={this.handleOpen}
          className={this.props.buttonClass}
          disabled={disabled}
        />
        <Dialog
          title={
            <div>
              Muokkaa tapahtumaa
              <button
                className="dialog-close-button"
                onClick={this.handleClose}
              >
                x
              </button>
            </div>
          }
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent
          bodyClassName="global--modal-body"
          contentClassName="global--modal-content"
          paperClassName="global--modal-paper"
        >
          <EventForm
            submitFunction={this.handleCloseAndSend.bind(this)}
            close={this.handleClose.bind(this)}
            update={this.update.bind(this)}
            data={this.state}
          />
        </Dialog>
      </div>
    )
  }
}

export default connect(null, { editEvent, bufferZoneInitialization, notify })(
  EditEvent
)
