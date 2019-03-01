import React from 'react'
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import PropTypes from 'prop-types'

const Notification = props => {
  if (props.notification === null) {
    return null
  }
  if (props.notification.textType === 'error') {
    return (
      <div className="footerError">
        <FontAwesome className="notification-icon" name="exclamation-circle" />
        {props.notification.text}
      </div>
    )
  }
  return (
    <div className="footerSuccess">
      <FontAwesome className="notification-icon" name="check-circle" />
      {props.notification.text}
    </div>
  )
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
