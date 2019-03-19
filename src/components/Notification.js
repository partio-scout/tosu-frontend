import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

/**
 * Notification that is used in the footer element
 * @param props contains the message that is added to the notification
 */
const Notification = props => {
  if (props.notification === null) {
    return null
  }
  if (props.notification.textType === 'error') {
    return <div className="footerError">{props.notification.text}</div>
  }
  return <div className="footerSuccess">{props.notification.text}</div>
}

const mapStateToProps = state => ({
  notification: state.notification,
})

Notification.propTypes = {
  notification: PropTypes.shape({
    text: PropTypes.string.isRequired,
    textType: PropTypes.string.isRequired,
  }).isRequired,
}

export default connect(mapStateToProps)(Notification)
