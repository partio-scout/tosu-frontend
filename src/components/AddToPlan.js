import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { DialogTitle, DialogActions, DialogContent } from '@material-ui/core'

import { addEventFromKuksa } from '../reducers/eventReducer'
import PropTypes from 'prop-types'

class AddToPlan extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    addEventFromKuksa: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    buttonClass: PropTypes.string,
  }
  state = { dialogOpen: false }

  addEventToTosu = async () => {
    this.handleButtonDialogClose()
    // The event has event.kuksaEventId -> backend will know it's a synced event.
    try {
      delete this.props.event.id
      await this.props.addEventFromKuksa(this.props.event)
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
          variant="contained"
          color="primary"
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
          <DialogContent>Tapahtuma synkronoidaan Kuksaan.</DialogContent>
          <DialogActions>
            <Button onClick={this.handleButtonDialogClose}>peruuta</Button>
            <Button onClick={this.addEventToTosu}>Lisää suunnitelmaan</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default connect(
  null,
  {
    notify,
    addEventFromKuksa,
  }
)(AddToPlan)
