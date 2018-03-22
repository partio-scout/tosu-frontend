import React from 'react'
import { connect } from 'react-redux'

class Notification extends React.Component {
  render() {
    if (this.props.notification === null) {
      return null
    }
if (this.props.notification.textType === 'error') {
  return <div className="footerError">{this.props.notification.text}</div>
} else {
  return <div className="footerSuccess">{this.props.notification.text}</div>
}
   
  }
}

const mapStateToProps = state => {
  return {
    notification: state.notification
  }
}

export default connect(mapStateToProps)(Notification)
