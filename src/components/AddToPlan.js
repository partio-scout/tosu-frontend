import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { editEvent } from '../reducers/eventReducer'
import { DialogTitle, DialogActions, DialogContent } from '@material-ui/core'

import { addEventFromKuksa } from '../reducers/eventReducer'

class AddToPlan extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dialogOpen: false,
    }
  }

  addEventToTosu = async () => {
    // The event has event.kuksaEventId -> backend will know it's a synced event.
    try {
      let eventData = this.props.event
      delete eventData.id
      await this.props.addEventFromKuksa(eventData)
      this.props.notify('Tapahtuma lisätty suunnitelmaan!', 'success')
    } catch (exception) {
      console.error('Error in adding event to tosu:', exception)
      this.props.notify('Tapahtuman lisäämisessä tuli virhe. Yritä uudestaan!')
    }
  }

  handleButtonDialogOpen = () => {
    this.setState({ dialogOpen: true })
  }

  handleButtonDialogClose = () => {
    this.setState({ dialogOpen: false })
  }

  render() {
    const event = this.props.event

    return (
      <div>
        <Button
          onClick={this.handleButtonDialogOpen}
          className={this.props.buttonClass}
          variant='contained'
        >
          Lisää omaan suunnitelmaan
        </Button>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleButtonDialogClose}
        >
          <DialogTitle>
            Lisätäänkö tapahtuma <b>{event.title}</b> omaan suunnitelmaan?
          </DialogTitle>
          <DialogContent>
            Tapahtuma synkronoidaan Kuksaan.
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleButtonDialogClose}>peruuta</Button>
            <Button onClick={this.addEventToTosu}>
              Lisää suunnitelmaan
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default connect(null, {
  notify,
  addEventFromKuksa,
})(AddToPlan)
