import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'
import isTouchDevice from 'is-touch-device'
import Paper from '@material-ui/core/Paper'
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
    information: '',
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
      information: '',
    })
    this.props.closeMe()
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
        information: this.state.information,
        tosuId: this.props.tosu.selected,
      }
      try {
        await this.sendEventPostRequest(data)
        if (!this.state.checked) {
          this.handleClose()
        }
      } catch (exception) {
        console.error('Error in event POST:', exception)
      }
    } else {
      // Send POST first to create new GroupId and then use id from response to create group of events. ß
      const response = await this.sendEventGroupIdPostRequest()
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
          eventGroupId: response.id,
          tosuId: this.props.tosu.selected,
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
      information: '',
    })
  }
  /**
   * Creates a new eventgroup
   * @returns eventGroup from the http response
   */
  sendEventGroupIdPostRequest = async () => {
    try {
      const eventGroup = await eventgroupService.create()
      return eventGroup
    } catch (exception) {
      console.error('Error in event POST:', exception)
      return null
    }
  }
  /**
   * Creates a new event and sends it to server. Also creates notification acknowledgeing the creation
   * @param eventData the new event
   */
  sendEventPostRequest = async eventData => {
    try {
      this.props.addEvent(eventData)
      if (eventData.eventGroupId === undefined) {
        this.props.notify('Uusi tapahtuma luotu!', 'success')
      } else {
        this.props.notify('Uusi toistuva tapahtuma luotu!', 'success')
      }
    } catch (exception) {
      console.error('Error in event POST:', exception)
      this.props.notify('Tapahtumaa ei voitu luoda!')
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
      information,
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
        <Paper className="new-form-paper">
          <EventForm
            submitFunction={this.handleCloseAndSend.bind(this)}
            close={this.handleClose.bind(this)}
            update={this.update.bind(this)}
            data={this.state}
            allowRepeatedEvent
          />
        </Paper>
      </div>
    )
  }
}

NewEvent.propTypes = {
  addEvent: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  tosu: PropTypes.string.isRequired,
}

NewEvent.defaultProps = {}

const mapStateToProps = state => ({
  tosu: state.tosu,
})

const mapDispatchToProps = {
  addEvent,
  notify,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEvent)
