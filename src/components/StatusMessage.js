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
        <strong>
          {taskgroup.title}{' '}
          {statusMessage.status.taskgroupDone ? <span>(valmis)</span> : null}
        </strong>
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
    return (
      <div style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
        <p style={{ marginBottom: 0 }}>
          <big>
            <strong>
              {taskgroup.title}{' '}
              {statusMessage.status.taskgroupDone ? (
                <span>(valmis)</span>
              ) : null}
            </strong>
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
          Valitse vapaaehtoiset aktiviteetit, valittu{' '}
          {statusMessage.status.nonMandatory
            ? statusMessage.status.nonMandatory.total
            : 0}{' '}
          {statusMessage.status.nonMandatory.done ? done : null}
        </p>
        <p style={{ margin: 0, marginLeft: 10 }}>
          Suhde itseen, valittu {statusMessage.status.nonMandatory.suhdeItseen}
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
        <p style={{ marginTop: 0 }}>
          Valitse majakkavaihtoehto{statusMessage.status.nonMandatory
            .majakka === 1
            ? done
            : null}
        </p>
      </div>
    )
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

  const statusbox = () => (
    <div>
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
    </div>
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
        {statusMessage.status && statusMessage.status.nonMandatory
          ? statusbox()
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
    this.state = {}
  }

  componentDidUpdate = () => {
    this.props.getHeight()
  }

  render() {
    const element = this.props.showStatusBox ? (
      <Instruction
        handleClose={this.props.handleClose}
        statusMessage={this.props.statusMessage}
        taskgroup={this.props.taskgroup}
        style={{ marginTop: 30 }}
      />
    ) : (
      <InfoButton handleOpen={this.props.handleOpen} />
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
