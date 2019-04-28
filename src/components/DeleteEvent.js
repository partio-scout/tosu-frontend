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
import { withSnackbar } from 'notistack'
import PropTypesSchema from '../utils/PropTypesSchema'

const styles = theme => ({
  button: {
    marginRight: theme.spacing.unit,
  },
  redbutton: {
    background: '#FE6B8B',
    color: 'white',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 14,
  },
})

class DeleteEvent extends React.Component {
  /**
   * Deletes a given event and creates a notification acknowledging it. Also closes the dialog box
   */
  state = { open: false }

  deleteEvent = async () => {
    this.handleClose()
    try {
      if (this.props.data.synced) {
        this.props.deleteSyncedEvent(this.props.data)
      } else {
        this.props.deleteEvent(this.props.data.id)
      }
      this.props.enqueueSnackbar('Tapahtuma poistettu', { variant: 'info' })
    } catch (exception) {
      console.error('Error in deleting event:', exception)
      this.props.enqueueSnackbar('Tapahtuman poistamisessa tuli virhe.', {
        variant: 'error',
      })
    }
  }
  /**
   * Deletes a given eventgroup and creates a notification acknowledging it. Also closes the dialog box
   */
  deleteEventGroup = async () => {
    this.handleClose()
    try {
      this.props.deleteEventGroup(this.props.data.eventGroupId)
      this.props.enqueueSnackbar('Toistuva tapahtuma poistettu', {
        variant: 'info',
      })
    } catch (exception) {
      console.error('Error in deleting event:', exception)
      this.props.enqueueSnackbar(
        'Toistuvan tapahtuman poistamisessa tuli virhe.',
        { variant: 'error' }
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
          <Button
            className={classes.button}
            variant="contained"
            onClick={this.handleClose}
          >
            peruuta
          </Button>
          <Button
            id="delete-one-recurrent-event"
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={this.deleteEvent}
            disabled={disabled}
          >
            Poista tämä tapahtuma
          </Button>
          <Button id="delete-recurrent-events" className={classes.redbutton} onClick={this.deleteEventGroup}>
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
          <Button
            className={classes.button}
            variant="contained"
            onClick={this.handleClose}
          >
            peruuta
          </Button>
          <Button
            id="confirm-delete"
            className={classes.redbutton}
            variant="contained"
            onClick={this.deleteEvent}
            disabled={disabled}
          >
            Poista tapahtuma
          </Button>
        </div>
      )
    }

    return (
      <div>
        <Button
          id="delete-event"
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
  deleteEventGroup,
  deleteSyncedEvent,
}

DeleteEvent.propTypes = {
  /**  PropTypes for DeleteEvent.
   * If eventGroupId exists, it's a recurring event, so we need to enable deleting those.
   * DeleteEvent never allows modifications to kuksaEvents (not synced).
   */
  data: PropTypesSchema.dataShape.isRequired,
  deleteSyncedEvent: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  deleteEventGroup: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  minimal: PropTypes.bool.isRequired,
  classes: PropTypesSchema.classesShape.isRequired,
}

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(withSnackbar(DeleteEvent)))
