import React from 'react'
import { connect } from 'react-redux'

class Notification extends React.Component {
  render() {
    if (this.props.notification === null) {
      return null
    }
    const style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1
    }

    return <div style={style}>{this.props.notification}</div>
  }
}

const mapStateToProps = state => {
  return {
    notification: state.notification
  }
}

export default connect(mapStateToProps)(Notification)
