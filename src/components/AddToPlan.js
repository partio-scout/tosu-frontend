import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import { DialogTitle, DialogActions, DialogContent } from '@material-ui/core'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
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
      this.props.enqueueSnackbar('Tapahtuma lisätty suunnitelmaan!', {
        variant: 'success',
      })
    } catch (exception) {
      console.error('Error in adding event to tosu:', exception)
      this.props.enqueueSnackbar('Tapahtuman lisäämisessä tuli virhe.', {
        variant: 'error',
      })
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
          id="add-kuksa"
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
            <Button variant="contained" onClick={this.handleButtonDialogClose}>
              peruuta
            </Button>
            <Button
              id="verify-add-kuksa" 
              variant="contained"
              color="primary"
              onClick={this.addEventToTosu}
            >
              Lisää suunnitelmaan
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapDispatchToProps = {
  addEventFromKuksa,
}

const mapStateToProps = state => ({
  tosu: state.tosu,
})

AddToPlan.propTypes = {
  event: PropTypesSchema.eventShape.isRequired,
  addEventFromKuksa: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  tosu: PropTypes.object.isRequired,
  buttonClass: PropTypes.string.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(AddToPlan))
