import React from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import ActionHelp from 'material-ui/svg-icons/action/help'
import Done from 'material-ui/svg-icons/action/done'
import Clear from 'material-ui/svg-icons/content/clear'

const style = {
  width: '95%',
  margin: 10,
  padding: 10
}

const Instruction = ({ handleClose, statusMessage, taskgroup }) => {
  const specialPlanInformation = () => (
    <p style={{ fontSize: '0.8rem' }}>
      <big>{taskgroup.title}</big>
      <br />
      {statusMessage.status.mandatory === taskgroup.tasks.length ? (
        <Done />
      ) : null}{' '}
      Valitse pakolliset aktiviteetit {statusMessage.status.mandatory} /{' '}
      {taskgroup.tasks.length}
      <br />
    </p>
  )

  const basicPlanInformation = () => (
    <p style={{ fontSize: '0.8rem' }}>
      <big>{taskgroup.title}</big>
      <br />
      {statusMessage.status.firstTask === 1 ? <Done /> : null} Valitse suuntaus<br />
      {statusMessage.status.mandatory === 5 ? <Done /> : null} Valitse
      pakolliset aktiviteetit {statusMessage.status.mandatory}/5<br />
      Valitse johtamis- ja vastuutehtävä<br />
      {statusMessage.status.leaderTask === 1 ? <Done /> : null}
      {statusMessage.status.nonMandatory === 4 ? <Done /> : null} Valitse
      vapaaehtoiset aktiviteetit {statusMessage.status.nonMandatory}/4<br />
    </p>
  )

  const extraPlanInformation = () => (
    <p style={{ fontSize: '0.8rem' }}>
      <big>{taskgroup.title}</big>
      <br />
      Valittuja aktiviteetteja {statusMessage.status.nonMandatory}
      <br />
    </p>
  )

  return (
    <div>
      <Paper style={style} zDepth={1}>
        <Clear
          style={{
            marginRight: 10,
            color: '#ccc',
          }}
          onClick={() => handleClose()}
        />
        {statusMessage.text}
        {(taskgroup && statusMessage.status.firstTaskgroup) ||
        (taskgroup && statusMessage.status.lastTaskgroup)
          ? specialPlanInformation()
          : null}
        {taskgroup &&
        !statusMessage.status.firstTaskgroup &&
        !statusMessage.status.lastTaskgroup &&
        !statusMessage.status.extraTaskgroup
          ? basicPlanInformation()
          : null}
        {taskgroup && statusMessage.status.extraTaskgroup
          ? extraPlanInformation()
          : null}
      </Paper>
    </div>
  )
}

const InfoButton = ({ handleOpen }) => (
  <ActionHelp
    style={{
      width: 30,
      height: 30,
      padding: 0,
      color: 'white',
      margin: 10,
      marginLeft: 20
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
