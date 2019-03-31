import React from 'react'
import Select from 'react-select'
import List from '@material-ui/icons/List'
import MenuItem from '@material-ui/core/MenuItem'
import { connect } from 'react-redux'
import AccountIcon from './AccountIcon'
import { notify } from '../reducers/notificationReducer'
import { addStatusMessage } from '../reducers/statusMessageReducer'
import { selectTaskgroup, emptyTaskgroup } from '../reducers/taskgroupReducer'
import StatusMessage from './StatusMessage'
import { createStatusMessage } from '../utils/createStatusMessage'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { getTask, getTaskGroup, getRootGroup } from '../functions/denormalizations'
import PropTypesSchema from './PropTypesSchema'

class MobileAppbar extends React.Component {
  state = { showStatusBox: true }

  componentDidMount = () => {
    this.getHeight()
  }

  componentDidUpdate = () => {
    this.getHeight()
    this.updateStatusMessage()
  }
  /**
   * Can toggle what is shown in the sidebar when in mobile view. Disabled by default.
   * @param taskgroup method needs to check if taskgroup is determined
   */
  onChangeTaskgroup = async taskgroup => {
    if (taskgroup === null) {
      this.setState({ treePlaceHolder: 'Valitse ensin tarppo' })
      this.props.addStatusMessage('Valitse ensin tarppo!')
      this.props.emptyTaskgroup()
      return
    }
    const selectedGroup = getTaskGroup(taskgroup.value, this.props.pofTree)
    this.props.selectTaskgroup(selectedGroup)
    this.updateStatusMessage()
    this.setState({ treePlaceHolder: 'Lisää aktiviteetti' })
  }

  getHeight = () => {
    const bufferZoneHeight = document.getElementById('top-bar-header')
      .clientHeight
    this.props.setHeaderHeight(bufferZoneHeight)
  }
  openUrl = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSddXqlQaFd8054I75s4UZEPeQAh_ardxRl11YYw3b2JBk0Y-Q/viewform'
    )
  }
  handleOpen = () => {
    this.setState({ showStatusBox: true })
  }

  handleClose = () => {
    this.setState({ showStatusBox: false })
  }

  updateStatusMessage = () => {
    if (!this.props.taskgroup) {
      this.props.addStatusMessage(1)
    } else {
      this.props.addStatusMessage(3)
    }
  }

  render() {
    let taskgroups = []
    if(!this.props.pofTree) {
        return (<div />)
    }
    taskgroups = getRootGroup(this.props.pofTree)
    if(!taskgroups) return (<div id="top-bar-header"/>)
    return (
      <div
        className="top-search"
        id="top-bar-header"
        style={{ background: '#5DBCD2', padding: 1 }}
      >
        <div className="Header_root" id="header_root">
          <div className="mobile-select">
            <Select
              menuContainerStyle={{ width: '100%' }}
              style={{ width: 200 }}
              name="form-field-name"
              value={this.props.taskgroup}
              placeholder="Valitse tarppo..."
              onChange={this.onChangeTaskgroup}
              options={taskgroups.map(taskgroup => {
                const status = createStatusMessage(
                  this.props.events,
                  this.props.pofTree,
                  taskgroup,
                  this.props.activities,
                )
                let labelText = taskgroup.label

                if (status.taskgroupDone) {
                  labelText = (
                    <span style={{ textDecoration: 'line-through' }}>
                      {labelText}
                    </span>
                  )
                }
                return {
                  value: taskgroup.guid,
                  label: labelText,
                }
              })}
            />
          </div>
          <div className="account-name-and-button">
            <AccountIcon
              accountIcon={<List />}
              mobileFeedback={
                <MenuItem onClick={this.openUrl}>Anna palautetta</MenuItem>
              }
            />
          </div>

          <div style={{ clear: 'both' }} />
        </div>

        {this.props.headerVisible ? (
          <div className="mobile-status-message-box">
            <StatusMessage
              showStatusBox={this.state.showStatusBox}
              handleClose={this.handleClose}
              handleOpen={this.handleOpen}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  events: state.events,
  buffer: state.buffer,
  pofTree: state.pofTree,
  taskgroup: state.taskgroup,
  status: state.statusMessage.status,
  scout: state.scout,
  activities: state.activities,
})

MobileAppbar.propTypes = {
  ...PropTypesSchema,
}

const mapDispatchToProps = {
  notify,
  addStatusMessage,
  selectTaskgroup,
  pofTreeUpdate,
  emptyTaskgroup,
}

MobileAppbar.defaultProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileAppbar)
