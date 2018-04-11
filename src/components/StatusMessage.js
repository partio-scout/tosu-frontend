import React from 'react'
import Paper from 'material-ui/Paper'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionHelp from 'material-ui/svg-icons/action/help'
import Clear from 'material-ui/svg-icons/content/clear'

const style = {
  width: '70%',
  margin: 20,
  padding: 10
}

const Instruction = ({ handleClose }) => (
  <div>
    <Paper style={style} zDepth={1}>
      <Clear
        style={{
          marginRight: 10,
          color: '#ccc',
        }}
        onClick={() => handleClose()}
      />
      Valitse ensin tarppo!
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

export default class StatusMessage extends React.Component {
  state = {
    open: true
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const element = this.state.open ? (
      <Instruction handleClose={this.handleClose} />
    ) : (
      <InfoButton handleOpen={this.handleOpen} />
    )
    return element
  }
}
