import React from 'react'
import { connect } from 'react-redux'
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {
  deleteEvent,
  deleteEventGroup,
  deleteSyncedEvent,
} from '../reducers/eventReducer'
import { notify } from '../reducers/notificationReducer'

const styles = theme => ({
  button: {
    marginLeft: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 14,
  },
})

class DeleteEvent extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.number.isRequired,
      synced: PropTypes.bool,
      eventGroupId: PropTypes.number,
      kuksaEvent: PropTypes.object,
    }).isRequired,
    deleteSyncedEvent: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    deleteEventGroup: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    minimal: PropTypes.bool.isRequired,
    classes: PropTypes.shape({}).isRequired,
  }
  state = { open: false }

  deleteEvent = async () => {
    this.handleClose()
    try {
      if (this.props.data.synced) {
        await this.props.deleteSyncedEvent(this.props.data)
      } else {
        await this.props.deleteEvent(this.props.data.id)
      }
      this.props.notify('Tapahtuma poistettu!', 'success')
    } catch (exception) {
      console.error('Error in deleting event:', exception)
      this.props.notify('Tapahtuman poistamisessa tuli virhe. Yritä uudestaan!')
    }
  }

  deleteEventGroup = async () => {
    this.handleClose()
    try {
      await this.props.deleteEventGroup(this.props.data.eventGroupId)
      this.props.notify('Toistuva tapahtuma poistettu!', 'success')
    } catch (exception) {
      console.error('Error in deleting event:', exception)
      this.props.notify(
        'Toistuvan tapahtuman poistamisessa tuli virhe. Yritä uudestaan!'
      )
    }
  }

  handleDelete = () => {
    this.handleOpen()
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render(props) {
    const { classes } = this.props
    const event = this.props.data
    const disabled = event.kuksaEvent // Never allow modifications to kuksaEvents (not synced)
    // This is the popup that appears if you click 'poista' on an event
    let actions = []
    // IfeventGroupId exists, it's a recurring event, so we need to enable deleting those
    if (event.eventGroupId) {
      actions = (
        <div>
          <Button onClick={this.handleClose}>peruuta</Button>
          <Button onClick={this.deleteEvent} disabled={disabled}>
            Poista tämä tapahtuma
          </Button>
          <Button onClick={this.deleteEventGroup}>
            Poista toistuvat tapahtumat
          </Button>
        </div>
      )
    } else {
      actions = (
        <div>
          {event.synced && (
            <p>Tapahtuma poistetaan suunnitelmastasi, mutta ei Kuksasta.</p>
          )}
          <Button onClick={this.handleClose}>peruuta</Button>
          <Button onClick={this.deleteEvent} disabled={disabled}>
            Poista tapahtuma
          </Button>
        </div>
      )
    }

    return (
      <div>
        <Button
          size={this.props.minimal ? 'small' : 'medium'}
          className={classes.button}
          onClick={this.handleDelete}
          variant="contained"
          color="primary"
          disabled={disabled}
        >
          Poista
          <DeleteIcon className={classes.rightIcon} />
        </Button>

        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Poistetaanko tapahtuma {event.title}?</DialogTitle>
          <DialogActions>{actions}</DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default connect(
  null,
  { deleteEvent, notify, deleteEventGroup, deleteSyncedEvent }
)(withStyles(styles)(DeleteEvent))
