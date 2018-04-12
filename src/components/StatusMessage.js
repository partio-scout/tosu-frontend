import React from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionHelp from 'material-ui/svg-icons/action/help'
import Clear from 'material-ui/svg-icons/content/clear'

const style = {
  width: '70%',
  margin: 20,
  padding: 10
}

const Instruction = ({ handleClose, text }) => (
  <div>
    <Paper style={style} zDepth={1}>
      <Clear
        style={{
          marginRight: 10,
          color: '#ccc'
        }}
        onClick={() => handleClose()}
      />
      {text}
    </Paper>
  </div>
)

const InfoButton = ({ handleOpen }) => (
  <ActionHelp
    style={{
      width: 72,
      height: 72,
      padding: 18,
      color: 'white'
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
    console.log('Status props', this.props)
    const element = this.state.open ? (
      <Instruction
        handleClose={this.handleClose}
        text={this.props.statusMessage}
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
