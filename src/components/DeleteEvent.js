import React from 'react'
import { connect } from 'react-redux'
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles } from '@material-ui/core/styles'
import {
  deleteEvent,
  deleteEventGroup,
  deleteSyncedEvent,
} from '../reducers/eventReducer'
import { notify } from '../reducers/notificationReducer'
import PropTypesSchema from './PropTypesSchema'

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
  /**  PropTypes for DeleteEvent.
   * If eventGroupId exists, it's a recurring event, so we need to enable deleting those.
   * DeleteEvent never allows modifications to kuksaEvents (not synced).
   */
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

  /**
   * Deletes a given event and creates a notification acknowledging it. Also closes the dialog box
   */
  deleteEvent = async () => {
    this.handleClose()
    try {
      if (this.props.data.synced) {
        this.props.deleteSyncedEvent(this.props.data)
      } else {
        this.props.deleteEvent(this.props.data.id)
      }
      this.props.notify('Tapahtuma poistettu!', 'success')
    } catch (exception) {
      console.error('Error in deleting event:', exception)
      this.props.notify('Tapahtuman poistamisessa tuli virhe. Yritä uudestaan!')
    }
  }
  /**
   * Deletes a given eventgroup and creates a notification acknowledging it. Also closes the dialog box
   */
  deleteEventGroup = async () => {
    this.handleClose()
    try {
      this.props.deleteEventGroup(this.props.data.eventGroupId)
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

  render() {
    const { classes } = this.props
    const event = this.props.data
    const disabled = event.kuksaEvent
    let actions = []
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

const mapDispatchToProps = {
  deleteEvent,
  notify,
  deleteEventGroup,
  deleteSyncedEvent,
}

DeleteEvent.propTypes = {
  ...PropTypesSchema,
}

DeleteEvent.defaultProps = {}

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(DeleteEvent))
