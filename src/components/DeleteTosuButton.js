import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withStyles,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { setLoading } from '../reducers/loadingReducer'
import { deleteTosu, selectTosu } from '../reducers/tosuReducer'
import { eventsInitialization } from '../reducers/eventReducer'
import { activityInitialization } from '../reducers/activityReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'

import { notify } from '../reducers/notificationReducer'

import tosuChange from '../functions/tosuChange'

const styles = () => ({
  root: {
    background: '#FE6B8B',
    color: 'white',
    borderRadius: 3,
    border: 0,
  },
  label: {
    textTransform: 'uppercase',
  },
})

const StyledButton = withStyles(styles)(Button)

class DeleteTosuButton extends Component {
  state = {
    open: false,
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }
  handleClose = () => {
    this.setState({ open: false })
  }
  deleteTosu = async e => {
    const {
      setLoading,
      tosu,
      deleteTosu,
      selectTosu,
      eventsInitialization,
      activityInitialization,
      initialization,
      pofTreeUpdate,
      notify,
      activities,
      buffer,
    } = this.props
    e.preventDefault()
    const toDelete = tosu.selected
    await deleteTosu(toDelete)
    if (this.props.tosu.selected) {
      tosuChange(
        this.props.tosu.selected,
        setLoading,
        selectTosu,
        eventsInitialization,
        activityInitialization,
        pofTreeUpdate,
        activities,
        buffer
      )
    } else {
      eventsInitialization({})
      initialization()
    }
    notify('Tosu poistettu', 'success')
    this.handleClose()
  }
  render() {
    const { tosu } = this.props
    if (Object.entries(tosu).length === 0) return <div />
    return (
      <div>
        <StyledButton
          classes={{ label: 'deleteTosuButton' }}
          variant="contained"
          onClick={() => this.handleClickOpen()}
        >
          Poista tosu <DeleteIcon />
        </StyledButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {' '}
            {'Haluatko varmasti poistaa tosun ?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Tosu poistetaan pysyvästi eikä sitä voi palauttaa.
            </DialogContentText>
            <DialogActions>
              <Button
                onClick={this.handleClose}
                variant="contained"
              >
                Peruuta
              </Button>
              <StyledButton id="confirm" onClick={this.deleteTosu}>
                {' '}
                Poista tosu{' '}
              </StyledButton>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  tosu: state.tosu,
  activities: state.activities,
  buffer: state.buffer,
})

const mapDispatchToProps = {
  setLoading,
  deleteTosu,
  selectTosu,
  eventsInitialization,
  activityInitialization,
  pofTreeUpdate,
  notify,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteTosuButton)
