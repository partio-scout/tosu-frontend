import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import Paper from '@material-ui/core/Paper'
import { DialogTitle } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
// import eventgroupService from '../services/eventgroups'
import moment from 'moment'
import { connect } from 'react-redux'
import EventForm from './EventForm'
import { notify } from '../reducers/notificationReducer'
import { editEvent } from '../reducers/eventReducer'
import { bufferZoneInitialization } from '../reducers/bufferZoneReducer'

const styles = theme => ({
  button: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 14,
  },
  eventForm: {
    maxWidth: 800,
    margin: '0 auto',
  },
  newFormPaper: {
    padding: 20,
  },
})

class EditEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      title: props.data.title,
      startDate: new Date(props.data.startDate),
      startTime: moment(
        `${props.data.startDate} ${props.data.startTime}`,
        'YYYY-MM-DD HH:mm'
      ).toDate(),
      endDate: new Date(props.data.endDate),
      endTime: moment(
        `${props.data.endDate} ${props.data.endTime}`,
        'YYYY-MM-DD HH:mm'
      ).toDate(),
      checked: false,
      repeatCount: 1,
      repeatFrequency: 0,
      type: props.data.type,
      information: props.data.information,
    }
  }
  componentWillReceiveProps(props) {
    if (this.state.information !== props.data.information) {
      this.setState({ information: props.data.information })
    }
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  /**
   * Closes the eventform and sends the changes to eventreducer
   */
  handleCloseAndSend = async () => {
    const moddedEvent = {
      id: this.props.data.id,
      title: this.state.title,
      startDate: moment(this.state.startDate).format('YYYY-MM-DD'),
      startTime: moment(this.state.startTime).format('HH:mm'),
      endDate: moment(this.state.endDate).format('YYYY-MM-DD'),
      endTime: moment(this.state.endTime).format('HH:mm'),
      type: this.state.type,
      information: this.state.information,
    }
    try {
      this.props.editEvent(moddedEvent)
      // await eventService.edit(data);
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
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      checked,
      // repeatCount,
      // repeatFrequency,
      type,
      information,
    })
  }

  render() {
    const { classes } = this.props
    const event = this.props.data
    // Never allow modifications to kuksaEvents (not synced)
    const disabled = event.synced || event.kuksaEvent // TODO: Allow editing after Kuksa sync works both ways (remove event.synced check)
    return (
      <div>
        {disabled ? null : (
          <Button
            size={this.props.minimal ? 'small' : 'medium'}
            onClick={this.handleOpen}
            className={classes.button}
            variant="contained"
            color="primary"
          >
            Muokkaa
            <Icon className={classes.rightIcon}>edit_icon</Icon>
          </Button>
        )}
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>
            {'Muokataan tapahtumaa'} {this.state.title}
          </DialogTitle>
          <div className={classes.eventForm}>
            <Paper className={classes.newFormPaper}>
              <EventForm
                submitFunction={this.handleCloseAndSend.bind(this)}
                close={this.handleClose.bind(this)}
                update={this.update.bind(this)}
                data={this.state}
              />
            </Paper>
          </div>
        </Dialog>
      </div>
    )
  }
}

const mapDispatchToProps = {
  editEvent,
  bufferZoneInitialization,
  notify,
}

EditEvent.propTypes = {
  editEvent: PropTypes.func.isRequired,
  bufferZoneInitialization: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
}

EditEvent.defaultProps = {}
export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(EditEvent))
