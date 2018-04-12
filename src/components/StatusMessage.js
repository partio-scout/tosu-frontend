import React from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import ActionHelp from 'material-ui/svg-icons/action/help'
import Clear from 'material-ui/svg-icons/content/clear'

const style = {
  width: '70%',
  margin: 20,
  padding: 10
}

const Instruction = ({ handleClose, statusMessage }) => (
  <div>
    <Paper style={style} zDepth={1}>
      <Clear
        style={{
          marginRight: 10,
          color: '#ccc',
          marginTop: 35
        }}
        onClick={() => handleClose()}
      />
      {statusMessage.text}<br />
      {statusMessage.status}
    </Paper>
  </div>
)

const InfoButton = ({ handleOpen }) => (
  <ActionHelp
    style={{
      width: 72,
      height: 72,
      padding: 18,
      color: 'white',
      marginTop: 35
    }}
    onClick={() => handleOpen()}
  />
)

class StatusMessage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: true
    }
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const element = this.state.open ? (
      <Instruction
        handleClose={this.handleClose}
        statusMessage={this.props.statusMessage}
        style={{ marginTop: 30 }}
      />
    ) : (
      <InfoButton handleOpen={this.handleOpen} />
    )
    return element
  }
}

const mapStateToProps = state => {
  return {
    statusMessage: state.statusMessage
  }
}

export default connect(mapStateToProps)(StatusMessage)
