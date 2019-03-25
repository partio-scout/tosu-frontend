import React from 'react'
import { connect } from 'react-redux'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import { createTosu } from '../reducers/tosuReducer'
import PropTypesSchema from './PropTypesSchema'

class TosuDialog extends React.Component {
  state = {
    open: false,
    name: '',
  }
  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value })
  }

  handleTosuCreate = () => {
    this.handleClose()
    this.props.createTosu(this.state.name)
  }

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="tosu-dialog-title"
      >
        <DialogTitle id="tosu-dialog-title">
          Uusi toimintasuunnitelma
        </DialogTitle>
        <DialogContent>
          <TextField
            value={this.state.name}
            onChange={this.handleNameChange}
            autoFocus
            id="name"
            label="nimi"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            peruuta
          </Button>
          <Button
            onClick={this.handleTosuCreate}
            variant="contained"
            color="primary"
          >
            luo uusi
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

TosuDialog.propTypes = {
  ...PropTypesSchema,
}

const mapDispatchToProps = {
  createTosu,
}

export default connect(
  null,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(TosuDialog)
