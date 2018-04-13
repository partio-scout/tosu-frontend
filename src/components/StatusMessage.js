import React from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import ActionHelp from 'material-ui/svg-icons/action/help'
import Done from 'material-ui/svg-icons/action/done'
import Clear from 'material-ui/svg-icons/content/clear'

const style = {
  width: '70%',
  margin: 20,
  padding: 10
}

const Instruction = ({ handleClose, statusMessage, taskgroup }) => {
  console.log('Status message: ', statusMessage)
  const planInformation = () => (
    <p style={{fontSize: "0.8rem"}}>
      <h4>{taskgroup.title}</h4>
      {statusMessage.status.firstTask === 1 ? <Done /> : null} Valitse suuntaus<br />
      {statusMessage.status.mandatory === 5 ? <Done /> : null} Valitse
      pakolliset aktiviteetit {statusMessage.status.mandatory}/5<br />
      Valitse johtamis- ja vastuutehtävä<br />
      {statusMessage.status.leaderTask === 1 ? <Done /> : null}
      {statusMessage.status.firstTask === 4 ? <Done /> : null} Valitse
      vapaaehtoiset aktiviteetit {statusMessage.status.nonMandatory}/4<br />
    </p>
  )
  return (
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
        {statusMessage.text}
        {taskgroup ? planInformation() : null}
      </Paper>
    </div>
  )
}

const InfoButton = ({ handleOpen }) => (
  <ActionHelp
    style={{
      width: 54,
      height: 54,
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
        taskgroup={this.props.taskgroup}
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
    statusMessage: state.statusMessage,
    taskgroup: state.taskgroup
  }
}

export default connect(mapStateToProps)(StatusMessage)
