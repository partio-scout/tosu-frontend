import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import { DialogTitle, DialogActions, DialogContent } from '@material-ui/core'
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'
import PropTypesSchema from '../utils/PropTypesSchema'

import { addEventFromKuksa } from '../reducers/eventReducer'

class AddToPlan extends React.Component {
  state = { dialogOpen: false }

  /**
   * Adds a Kuksa event to local plan. The event has event.kuksaEventId -> backend will know it's a synced event.
   */
  addEventToTosu = async () => {
    this.handleButtonDialogClose()
    try {
      delete this.props.event.id
      await this.props.addEventFromKuksa({
        ...this.props.event,
        tosuId: this.props.tosu.selected,
      })
      this.props.notify('Tapahtuma lisätty suunnitelmaan!', 'success')
    } catch (exception) {
      console.error('Error in adding event to tosu:', exception)
      this.props.notify('Tapahtuman lisäämisessä tuli virhe. Yritä uudestaan!')
    }
  }
  /**
   * Opens the dialog box
   */
  handleButtonDialogOpen = () => {
    this.setState({ dialogOpen: true })
  }
  /**
   * Closes the dialog box
   */
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

const mapDispatchToProps = {
  notify,
  addEventFromKuksa,
}

const mapStateToProps = state => ({
  tosu: state.tosu,
})

AddToPlan.propTypes = {
  event: PropTypesSchema.eventShape.isRequired,
  addEventFromKuksa: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  tosu: PropTypes.func.isRequired,
  buttonClass: PropTypes.string.isRequired,
}

AddToPlan.defaultProps = {}

export default connect(
  mapStateToProps,
  {
    notify,
    addEventFromKuksa,
  }
)(AddToPlan)
