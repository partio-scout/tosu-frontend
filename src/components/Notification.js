import React from 'react'
import { connect } from 'react-redux'

const Notification = props => {

  if (props.notification === null) {
    return null
  }
  if (props.notification.textType === 'error') {
    return <div className="footerError">{props.notification.text}</div>
  }
  return <div className="footerSuccess">{props.notification.text}</div>



}

const mapStateToProps = state => {
  return {
    notification: state.notification
  }
}

export default connect(mapStateToProps)(Notification)
