import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Snackbar, IconButton, SnackbarContent } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import { withStyles } from '@material-ui/core/styles'
import { resetNotify } from '../reducers/notificationReducer'

const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
})

class Notification extends React.Component {
  /**
   * Prevents closing by clicking outside the notification.
   */
  handleClose = (event, reason) =>
    reason === 'clickaway' ? null : this.props.resetNotify()

  render() {
    const { notification, classes } = this.props

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={notification}
        autoHideDuration={6000}
        onClose={this.handleClose}
      >
        <SnackbarContent
          className={notification ? classes[notification.type] : null}
          message={
            <span id="message-id">
              {notification ? notification.text : null}
            </span>
          }
          action={[
            <IconButton
              key="close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>,
          ]}
        />
      </Snackbar>
    )
  }
}

const mapStateToProps = state => ({
  notification: state.notification,
})

const mapDispatchToProps = {
  resetNotify,
}

Notification.propTypes = {
  notification: PropTypes.isRequired,
  classes: PropTypes.object.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Notification))
