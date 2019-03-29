import React from 'react'
import { connect } from 'react-redux'
import PropTypesSchema from './PropTypesSchema'
import { withStyles } from '@material-ui/core'

const styles = {
  footerError: {
    color: '#f44336',
    backgroundColor: '#ffebee',
    borderTop: '2px solid #f44336',
    padding: 10,
    textAlign: 'center',
    fontSize: '1.1rem',
    position: 'fixed',
    bottom: 0,
    left: 0,
    height: 'auto',
    width: '100%',
  },
  footerSuccess: {
    color: '#4caf50',
    backgroundColor: '#e8f5e9',
    borderTop: '2px solid #4caf50',
    padding: 10,
    textAlign: 'center',
    fontSize: '1.1rem',
    position: 'fixed',
    bottom: 0,
    left: 0,
    height: 'auto',
    width: '100%',
  },
}

/**
 * Notification that is used in the footer element
 * @param props contains the message that is added to the notification
 */
function Notification(props) {
  if (props.notification === null) {
    return null
  }
  if (props.notification.textType === 'error') {
    return (
      <div className={props.classes.footerError}>{props.notification.text}</div>
    )
  }
  return (
    <div className={props.classes.footerSuccess}>{props.notification.text}</div>
  )
}

const mapStateToProps = state => ({
  notification: state.notification,
})

Notification.propTypes = {
  ...PropTypesSchema,
}

Notification.defaultProps = {}

export default connect(mapStateToProps)(withStyles(styles)(Notification))
