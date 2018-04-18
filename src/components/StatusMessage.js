import React from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import ActionHelp from 'material-ui/svg-icons/action/help'
import Done from 'material-ui/svg-icons/action/done'
import Clear from 'material-ui/svg-icons/content/clear'

const style = {
  width: '95%',
  margin: 10,
  padding: 10,
  fontSize: '0.9rem'
}

const done = (
  <Done
    style={{
      width: 15,
      height: 15,
      padding: 0,
      marginLeft: 5,
      color: 'green'
    }}
  />
)
const Instruction = ({ handleClose, statusMessage, taskgroup }) => {
  const specialPlanInformation = () => (
    <p style={{ fontSize: '0.8rem' }}>
      <big>
        <strong>{taskgroup.title}</strong>
      </big>
      <br />
      {statusMessage.status.mandatory === taskgroup.tasks.length
        ? done
        : null}{' '}
      Valitse pakolliset aktiviteetit {statusMessage.status.mandatory} /{' '}
      {taskgroup.tasks.length}
      <br />
    </p>
  )

  const basicPlanInformation = () => {
    if (statusMessage.status.nonMandatory) {
      return (
        <p style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
          <big>
            <strong>{taskgroup.title}</strong>
          </big>
          <br />
          Valitse suuntaus {statusMessage.status.firstTask === 1 ? done : null}
          <br />
          Valitse pakolliset aktiviteetit {
            statusMessage.status.mandatory
          }/5 {statusMessage.status.mandatory === 5 ? done : null}
          <br />
          Valitse johtamis- ja vastuutehtävä{' '}
          {statusMessage.status.leaderTask === 1 ? done : null}
          <br />
          Valitse vapaaehtoiset aktiviteetit, valittu yhteensä{' '}
          {statusMessage.status.nonMandatory
            ? statusMessage.status.nonMandatory.total
            : 0}{' '}
          {statusMessage.status.nonMandatory.done ? done : null}
          <p style={{ margin: 0, marginLeft: 10 }}>
            Suhde itseen, valittu{' '}
            {statusMessage.status.nonMandatory.suhdeItseen}
            {statusMessage.status.nonMandatory.suhdeItseen >= 1 ? done : null}
            <br />
            Suhde toiseen, valittu{' '}
            {statusMessage.status.nonMandatory.suhdeToiseen}
            {statusMessage.status.nonMandatory.suhdeToiseen >= 1 ? done : null}
            <br />
            Suhde yhteiskuntaan, valittu{' '}
            {statusMessage.status.nonMandatory.suhdeYhteiskuntaan}
            {statusMessage.status.nonMandatory.suhdeYhteiskuntaan >= 1
              ? done
              : null}
            <br />
            Suhde ympäristöön, valittu{' '}
            {statusMessage.status.nonMandatory.suhdeYmparistoon}
            {statusMessage.status.nonMandatory.suhdeYmparistoon >= 1
              ? done
              : null}
          </p>
          Valitse majakkavaihtoehto{statusMessage.status.nonMandatory.majakka === 1
              ? done
              : null}
        </p>
      )
    }
    return <p style={{ fontSize: '0.8rem' }}>Haetaan tietoja...</p>
  }

  const extraPlanInformation = () => (
    <p style={{ fontSize: '0.8rem' }}>
      <big>
        <strong>{taskgroup.title}</strong>
      </big>
      <br />
      Valittuja aktiviteetteja {statusMessage.status.extraTask}
      <br />
    </p>
  )

  return (
    <div>
      <Paper style={style} zDepth={1}>
        <Clear
          style={{
            width: 20,
            height: 20,
            padding: 0,
            marginRight: 10,
            color: '#ccc'
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
