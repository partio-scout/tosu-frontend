import React from 'react'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import isTouchDevice from 'is-touch-device'
import Paper from 'material-ui/Paper'
import eventgroupService from '../services/eventgroups'
import FrequentEventsHandler from '../utils/FrequentEventsHandler'
import EventForm from './EventForm'
import { addEvent } from '../reducers/eventReducer'
import { notify } from '../reducers/notificationReducer'

class NewEvent extends React.Component {
  state = {
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    checked: false,
    repeatCount: '',
    repeatFrequency: '',
    type: '',
    information: ''
  }

  handleClose = () => {
    this.setState({
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      checked: false,
      repeatCount: '',
      repeatFrequency: '',
      type: '',
      information: ''
    })
    this.props.toggleTopBar()
    this.props.history.push('/')
  }

  handleCloseAndSend = async () => {
    const { startDate, endDate } = this.state
    if (!this.state.checked) {
      const data = {
        title: this.state.title,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        startTime: moment(this.state.startTime).format('HH:mm'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
        endTime: moment(this.state.endTime).format('HH:mm'),
        type: this.state.type,
        information: this.state.information
      }

      await this.sendEventPostRequest(data)
      if (!this.state.checked) {
        this.handleClose()
      }
    } else {
      // Send POST first to create new GroupId and then use id from response to create group of events. ß
      let response = await this.sendGroupIdPostRequest()

      let promises = []

      for (let i = 0; i < this.state.repeatCount; i += 1) {
        const newStartDate = FrequentEventsHandler(
          this.state.startDate,
          this.state.repeatFrequency,
          i
        ).format('YYYY-MM-DD')

        const newEndDate = FrequentEventsHandler(
          this.state.endDate,
          this.state.repeatFrequency,
          i
        ).format('YYYY-MM-DD')
        const data = {
          title: this.state.title,
          startDate: newStartDate,
          startTime: moment(this.state.startTime).format('HH:mm'),
          endDate: newEndDate,
          endTime: moment(this.state.endTime).format('HH:mm'),
          type: this.state.type,
          information: this.state.information,
          groupId: response.groupId
        }

        promises = promises.concat(this.sendEventPostRequest(data))
        if (i === this.state.repeatCount - 1) {
          this.handleClose()
        }
      }

      try {
        await Promise.all(promises)
      } catch (exception) {
        console.error('Error in event POST:', exception)
      }
    }
    this.setState({
      title: '',
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      checked: false,
      repeatCount: '',
      repeatFrequency: '',
      type: '',
      information: ''
    })
  }

  sendGroupIdPostRequest = async () => {
    try {
      const groupId = await eventgroupService.create()
      return groupId
    } catch (exception) {
      console.error('Error in event POST:', exception)
      return null
    }
  }

  sendEventPostRequest = async eventData => {
    try {
      await this.props.addEvent(eventData)
      if (eventData.groupId === undefined) {
        this.props.notify('Uusi tapahtuma luotu!', 'success')
      } else {
        this.props.notify('Uusi toistuva tapahtuma luotu!', 'success')
      }
    } catch (exception) {
      console.error('Error in event POST:', exception)
      this.props.notify(
        'Tapahtumaa ei voitu luoda!'
      )
    }
  }

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
    })
  }

  render() {
    if (isTouchDevice()) {
      return (
        <div className="event-form">
          <EventForm
            submitFunction={this.handleCloseAndSend.bind(this)}
            close={this.handleClose.bind(this)}
            update={this.update.bind(this)}
            data={this.state}
          />
        </div>
      )
    }
    return (
      <div className="event-form">
        <Paper zDepth={2} className="new-form-paper">
          <EventForm
            submitFunction={this.handleCloseAndSend.bind(this)}
            close={this.handleClose.bind(this)}
            update={this.update.bind(this)}
            data={this.state}
          />
        </Paper>
      </div>
    )
  }
}

const connected = connect(null, { addEvent, notify })(NewEvent)
export default withRouter(connected)
