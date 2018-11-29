import React from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import ActionHelp from '@material-ui/icons/Help'
import Done from '@material-ui/icons/Done'
import Warning from '@material-ui/icons/Warning'
import Clear from '@material-ui/icons/Clear'

// Done icon
const done = (
  <Done
    className='done'
    key='done'
  />
)

// Small done icon for sub-taskgroups (suhteet)
const smallDone = (
  <Done
    className='small-done'
    key='done'
  />
)

// Warning icon
const warning = message => (
  <div className="tooltip"  key='warning'>
    <Warning
      className='warning'
    />
    <span className="tooltiptext">
      {message}
    </span>
  </div>
)

const Instruction = ({ handleClose, statusMessage, taskgroup }) => {
  console.log(statusMessage)
  // Information in status box when taskgroup is first or last and contains only mandatory tasks
  const specialPlanInformation = () => (
    <div style={{ fontSize: '0.8rem', lineHeight: '1.6rem' }}>
      <p>
        <h2>
          {taskgroup.title}{' '}
          {statusMessage.status.taskgroupDone ? <span>(valmis)</span> : null}
        </h2>

        {statusMessage.status.taskgroupDone
          ? [done, `Pakolliset aktiviteetit valittu ${statusMessage.status.dates.mandatory}`]
          : `Valitse pakolliset aktiviteetit ${statusMessage.status.mandatory}/${taskgroup.children.length}`
        }
        <br />
      </p>
    </div>
  )

  // Information in status box for all Tarppos
  const basicPlanInformation = () => (
    <div style={{ fontSize: '0.8rem', lineHeight: '1.4rem' }}>
      <div style={{ marginBottom: 0 }}>
        <h2>
          {taskgroup.title}{' '}
          {statusMessage.status.taskgroupDone ? (<span>(valmis)</span>) : null}
        </h2>

        {statusMessage.status.firstTask === 1
          ? [
              (statusMessage.status.warnings.firstTaskTooLate ? warning(statusMessage.status.warnings.firstTaskTooLate) : done),
              `Suuntaus valittu - ${statusMessage.status.dates.firstTask}`
            ]
          : 'Valitse suuntaus'
        }
        <br />
        {statusMessage.status.mandatory === 5
          ? [done, `Pakolliset aktiviteetit valittu - ${statusMessage.status.dates.mandatory}`]
          : `Valitse pakolliset aktiviteetit ${statusMessage.status.mandatory}/5`
        }
        <br />

        {statusMessage.status.leaderTask === 1
          ? [done, `Johtamis- tai vastuutehtävä valittu - ${statusMessage.status.dates.leaderTask}`]
          : 'Valitse johtamis- tai vastuutehtävä'
        }
        <br />

        {statusMessage.status.nonMandatory.total === 4
          ? [done, `Vapaaehtoiset aktiviteetit valittu - ${statusMessage.status.dates.nonMandatory}`]
          : `Valitse vapaaehtoiset aktiviteetit ${statusMessage.status.nonMandatory.total}/4`
        }
      </div>

      <p style={{ margin: 0, marginLeft: 20 }}>
        {statusMessage.status.nonMandatory.suhdeItseen >= 1
            ? [smallDone, `Suhde itseen, valittu ${statusMessage.status.nonMandatory.suhdeItseen} `, ` - ${statusMessage.status.dates.suhdeItseen}`]
            : `Suhde itseen, valittu ${statusMessage.status.nonMandatory.suhdeItseen} `
        }
        <br />
          
        {statusMessage.status.nonMandatory.suhdeToiseen >= 1
            ? [smallDone, `Suhde toiseen, valittu ${statusMessage.status.nonMandatory.suhdeToiseen} `, ` - ${statusMessage.status.dates.suhdeToiseen}`]
            : `Suhde toiseen, valittu ${statusMessage.status.nonMandatory.suhdeToiseen} `
        }
        <br />

        {statusMessage.status.nonMandatory.suhdeYhteiskuntaan >= 1
            ? [smallDone,  `Suhde yhteiskuntaan, valittu ${statusMessage.status.nonMandatory.suhdeYhteiskuntaan} `,  ` - ${statusMessage.status.dates.suhdeYhteiskuntaan}`]
            : `Suhde yhteiskuntaan, valittu ${statusMessage.status.nonMandatory.suhdeYhteiskuntaan} `
        }
        <br />
          
        {statusMessage.status.nonMandatory.suhdeYmparistoon >= 1
          ? [smallDone, `Suhde ympäristöön, valittu ${statusMessage.status.nonMandatory.suhdeYmparistoon} `, ` - ${statusMessage.status.dates.suhdeYmparistoon}`]
          : `Suhde ympäristöön, valittu ${statusMessage.status.nonMandatory.suhdeYmparistoon} `
        }
      </p>

      <div style={{ marginTop: 0, marginBottom: 0 }}>
        {statusMessage.status.nonMandatory.majakka === 1
          ? [ 
              (statusMessage.status.warnings.lastTaskTooSoon ? warning(statusMessage.status.warnings.lastTaskTooSoon) : done),
              `Majakkavaihtoehto valittu ${statusMessage.status.dates.majakka}`
            ]
          : 'Valitse majakkavaihtoehto'
        }
      </div>
    </div>
    )

  // Information in status box when taskgroup is extra tasks (paussit)
  const extraPlanInformation = () => (
    <div style={{ fontSize: '0.8rem', lineHeight: '1.6rem' }}>
      <p style={{ marginBottom: 0 }}>
        <big>
          <strong>{taskgroup.title}</strong>
        </big>
        <br />
        Valittuja aktiviteetteja {statusMessage.status.extraTask.total}
      </p>
      <p style={{ margin: 0, marginLeft: 20 }}>
        Suhde itseen, valittu {statusMessage.status.extraTask.suhdeItseen}
        <br />
        Suhde toiseen, valittu {statusMessage.status.extraTask.suhdeToiseen}
        <br />
        Suhde yhteiskuntaan, valittu{' '}
        {statusMessage.status.extraTask.suhdeYhteiskuntaan}
        <br />
        Suhde ympäristöön, valittu{' '}
        {statusMessage.status.extraTask.suhdeYmparistoon}{' '}
      </p>
    </div>
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
    <div className='status-message-container'>
      <div className='inner-status-message-container'>
        <Paper className='status-box'>
          <Clear
            className='clear'
            onClick={() => handleClose()}
          />
          {statusMessage.text}
          {statusMessage.status && statusMessage.status.nonMandatory
            ? statusbox()
            : null}
        </Paper>
      </div>
    </div >
  )
}

// Icon for statusbox if statusbox is hidden
const InfoButton = ({ handleOpen }) => (
  <ActionHelp
    className='action-help'
    onClick={() => handleOpen()}
  />
)

class StatusMessage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
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

const mapStateToProps = state => ({
    statusMessage: state.statusMessage,
    taskgroup: state.taskgroup
  })

export default connect(mapStateToProps)(StatusMessage)
