import React from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import ActionHelp from 'material-ui/svg-icons/action/help'
import Done from 'material-ui/svg-icons/action/done'
import Warning from 'material-ui/svg-icons/alert/warning'
import Clear from 'material-ui/svg-icons/content/clear'

const style = {
  width: '95%',
  margin: 10,
  padding: 10,
  paddingLeft: 25,
  fontSize: '0.9rem'
}

const done = (
  <Done
    style={{
      width: 15,
      height: 15,
      padding: 0,
      marginRight: 7,
      color: 'green'
    }}
  />
)

const smallDone = (
  <Done
    style={{
      width: 10,
      height: 10,
      padding: 0,
      marginRight: 7,
      color: 'green'
    }}
  />
)

const warning = (
  <Warning
    style={{
      width: 15,
      height: 15,
      padding: 0,
      marginRight: 7,
      color: 'orange'
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
      {statusMessage.status.taskgroupDone ? done : null}

      {statusMessage.status.taskgroupDone
        ? `Pakolliset aktiviteetit valittu ${
            statusMessage.status.dates.mandatory
          }`
        : `Valitse pakolliset aktiviteetit ${statusMessage.status.mandatory}/${
            taskgroup.children.length
          }`}

      <br />
    </p>
  )

  const basicPlanInformation = () => {
    return (
      <div style={{ fontSize: '0.8rem', lineHeight: '1.6rem' }}>
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
          {statusMessage.status.firstTask === 1 &&
          !statusMessage.status.warnings.firstTaskTooLate
            ? done
            : null}
          {statusMessage.status.warnings.firstTaskTooLate ? warning : null}

          {statusMessage.status.firstTask === 1
            ? `Suuntaus valittu - ${statusMessage.status.dates.firstTask}`
            : 'Valitse suuntaus'}

          <br />
          {statusMessage.status.mandatory === 5 ? done : null}

          {statusMessage.status.mandatory === 5
            ? `Pakolliset aktiviteetit valittu - ${
                statusMessage.status.dates.mandatory
              }`
            : `Valitse pakolliset aktiviteetit ${
                statusMessage.status.mandatory
              }/5`}

          <br />
          {statusMessage.status.leaderTask === 1 ? done : null}
          {statusMessage.status.leaderTask === 1
            ? `Johtamis- tai vastuutehtävä valittu - ${
                statusMessage.status.dates.leaderTask
              }`
            : 'Valitse johtamis- tai vastuutehtävä'}

          <br />
          {statusMessage.status.nonMandatory.total === 4 ? done : null}

          {statusMessage.status.nonMandatory.total === 4
            ? `Vapaaehtoiset aktiviteetit valittu - ${
                statusMessage.status.dates.nonMandatory
              }`
            : `Valitse vapaaehtoiset aktiviteetit ${
                statusMessage.status.nonMandatory.total
              }/4`}
        </p>
        <p style={{ margin: 0, marginLeft: 20 }}>
          {statusMessage.status.nonMandatory.suhdeItseen >= 1 ? smallDone : null}
          Suhde itseen, valittu {
            statusMessage.status.nonMandatory.suhdeItseen
          }{' '}
          {statusMessage.status.nonMandatory.suhdeItseen >= 1
            ? ` - ${statusMessage.status.dates.suhdeItseen}`
            : null}
          <br />
          {statusMessage.status.nonMandatory.suhdeToiseen >= 1 ? smallDone : null}
          Suhde toiseen, valittu{' '}
          {statusMessage.status.nonMandatory.suhdeToiseen}{' '}
          {statusMessage.status.nonMandatory.suhdeToiseen >= 1
            ? ` - ${statusMessage.status.dates.suhdeToiseen}`
            : null}
          <br />
          {statusMessage.status.nonMandatory.suhdeYhteiskuntaan >= 1
            ? smallDone
            : null}
          Suhde yhteiskuntaan, valittu{' '}
          {statusMessage.status.nonMandatory.suhdeYhteiskuntaan}{' '}
          {statusMessage.status.nonMandatory.suhdeYhteiskuntaan >= 1
            ? ` - ${statusMessage.status.dates.suhdeYhteiskuntaan}`
            : null}
          <br />
          {statusMessage.status.nonMandatory.suhdeYmparistoon >= 1
            ? smallDone
            : null}
          Suhde ympäristöön, valittu{' '}
          {statusMessage.status.nonMandatory.suhdeYmparistoon}{' '}
          {statusMessage.status.nonMandatory.suhdeYmparistoon >= 1
            ? ` - ${statusMessage.status.dates.suhdeYmparistoon}`
            : null}
        </p>
        <p style={{ marginTop: 0, marginBottom: 0 }}>
          {statusMessage.status.nonMandatory.majakka === 1 &&
          !statusMessage.status.warnings.lastTaskTooSoon
            ? done
            : null}
          {statusMessage.status.warnings.lastTaskTooSoon ? warning : null}
          {statusMessage.status.nonMandatory.majakka === 1
            ? `Majakkavaihtoehto valittu ${statusMessage.status.dates.majakka}`
            : 'Valitse majakkavaihtoehto'}
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
