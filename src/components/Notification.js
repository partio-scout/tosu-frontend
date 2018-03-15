import React from 'react'
import { connect } from 'react-redux'

class Notification extends React.Component {
  render() {
    if (this.props.notification.length === 0) {
      return null
    }
    const style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1
    }

    console.log('This props', this.props)
    console.log('noti', this.props.store.getState())

    return <div style={style}>{this.props.store.getState().notification}</div>
  }
}

const mapStateToProps = state => {
  return {
    notification: state.notification
  }
}

export default connect(mapStateToProps)(Notification)
