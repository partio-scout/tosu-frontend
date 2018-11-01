import React from 'react'
import { connect } from 'react-redux'
import { Button, Dialog } from '@material-ui/core'

import { deleteEvent, deleteEventGroup } from '../reducers/eventReducer'
import { notify } from '../reducers/notificationReducer'

class DeleteEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  deleteEvent = async () => {
    try {
      await this.props.deleteEvent(this.props.data.id)
      await this.props.bufferZoneInitialization()
      await this.emptyBuffer()
      this.props.notify('Tapahtuma poistettu!', 'success')
      this.handleClose()
    } catch (exception) {
      console.error('Error in deleting event:', exception)
      this.props.notify('Tapahtuman poistamisessa tuli virhe. Yritä uudestaan!')
    }
  }

  deleteEventGroup = async () => {
    try {
      await this.props.deleteEventGroup(this.props.data.groupId)
      this.props.notify('Toistuva tapahtuma poistettu!', 'success')
      await this.props.bufferZoneInitialization()
      await this.emptyBuffer()
      this.handleClose()
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
    const event  = this.props.data
    // This is the popup that appears if you click "poista" on an event
    let actions = []
    // If groupId exists, it's a recurring event, so we need to enable deleting those
    if (event.groupId) {
      actions = (
        <div>
          <p>Poistetaanko tapahtuma {event.title}?</p>
          <Button onClick={this.handleClose}>peruuta</Button>
          <Button
            onClick={this.deleteEvent}
          >Poista tämä tapahtuma
          </Button>
          <Button
            onClick={this.deleteEventGroup}
          >
            Poista toistuvat tapahtumat
          </Button>
        </div>
      )
    } else {
      actions = (
        <div>
          <p>Poistetaanko tapahtuma {event.title}?</p>
          <Button onClick={this.handleClose} >peruuta</Button>
          <Button onClick={this.deleteEvent}>
            Poista tapahtuma
          </Button>
        </div>
      )
    }

    return (
      <div>
        <Button
          className="buttonRight"
          onClick={this.handleDelete}
          variant='contained'
        >
          Hello World
        </Button>

        <Dialog open={this.state.open} onClose={this.handleClose}>
          <div>
            {actions}
          </div>
        </Dialog>
      </div>
    )
  }
}

export default connect(null, { deleteEvent, notify })(
  DeleteEvent
)