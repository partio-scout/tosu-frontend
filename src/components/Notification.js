import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core'

const styles = theme => ({
  footer: {
    padding: 10,
    textAlign: 'center',
    fontSize: '1.1rem',
    position: 'fixed',
    bottom: 0,
    left: 0,
    height: 'auto',
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
  },
  footerError: {
    color: '#f44336',
    backgroundColor: '#ffebee',
    borderTop: '2px solid #f44336',
  },
  footerSuccess: {
    color: '#4caf50',
    backgroundColor: '#e8f5e9',
    borderTop: '2px solid #4caf50',
  },
})

/**
 * Notification that is used in the footer element
 * @param props contains the message that is added to the notification
 */
function Notification(props) {
  const { notification, classes } = props
  if (notification === null) {
    return null
  }
  if (notification.textType === 'error') {
    return (
      <div className={classes.footer + ' ' + classes.footerError}>
        {notification.text}
      </div>
    )
  }
  return (
    <div className={classes.footer + ' ' + classes.footerSuccess}>
      {notification.text}
    </div>
  )
}

const mapStateToProps = state => ({
  notification: state.notification,
})

Notification.propTypes = {
  notification: PropTypes.string.isRequired,
}

Notification.defaultProps = {}

export default connect(mapStateToProps)(withStyles(styles)(Notification))
