import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import TreeSelect /* , { TreeNode, SHOW_PARENT } */ from 'rc-tree-select'
import 'rc-tree-select/assets/index.css'
import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { postActivityToBuffer } from '../reducers/bufferZoneReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { addStatusMessage } from '../reducers/statusMessageReducer'
import { selectTaskgroup, emptyTaskgroup } from '../reducers/taskgroupReducer'
import { createStatusMessage } from '../utils/createStatusMessage'
import {
  getTask,
  getTaskGroup,
  getRootGroup,
} from '../functions/denormalizations'
import { eventList } from '../reducers/eventReducer'
import { addActivity } from '../reducers/activityReducer'
import { addActivityToRelevantReducers } from '../functions/activityFunctions'
import PropTypesSchema from '../utils/PropTypesSchema'

class TreeSearchBar extends React.Component {
  state = { treePlaceHolder: 'Valitse ensin tarppo' }

  componentDidUpdate = () => {
    this.updateStatusMessage()
  }

  onChange = value => {
    this.setState({ value })
  }

  onChangeChildren = async activityGuid => {
    if (this.isLeaf(activityGuid)) {
      try {
        await addActivityToRelevantReducers(this.props, { guid: activityGuid })
        this.props.pofTreeUpdate(this.props.activities)
        this.props.notify('Aktiviteetti on lisätty!', 'success')
      } catch (exception) {
        this.props.notify('Aktiviteettialue on täynnä!!')
      }
    }
  }

  onChangeTaskgroup = async taskgroup => {
    if (taskgroup === null) {
      this.setState({ treePlaceHolder: 'Valitse ensin tarppo' })
      this.props.addStatusMessage('Valitse ensin tarppo!')
      this.props.emptyTaskgroup()
      return
    }
    const selectedGroup = getTaskGroup(taskgroup.value.guid, this.props.pofTree)
    this.props.selectTaskgroup(selectedGroup)
    this.updateStatusMessage()
    this.setState({ treePlaceHolder: 'Lisää aktiviteetti' })
    const mandatoryActivities = selectedGroup.mandatory_tasks.split(',')
    if (mandatoryActivities[0] !== '') {
      // empty split return and array with only value as ''
      let activities = []
      this.props.buffer.activities.forEach(id => {
        const activity = this.props.activities[id]
        activities = activities.concat(activity.guid)
      })
      eventList(this.props.events).forEach(event => {
        event.activities.forEach(key => {
          const activity = this.props.activities[key]
          activities = activities.concat(activity.guid)
        })
      })
      const promises = mandatoryActivities.map(activity =>
        activities.includes(activity)
          ? null
          : addActivityToRelevantReducers(this.props, { guid: activity })
      )
      try {
        await Promise.all(promises)

        this.props.notify(
          'Pakolliset aktiviteetit lisätty tai olemassa!',
          'success'
        )
        this.props.pofTreeUpdate(this.props.activities)
      } catch (exception) {
        this.props.notify(
          'Kaikki pakolliset aktiviiteetit eivät mahtuneet alueelle tai ovat jo lisätty!'
        )
      }
    }
    this.props.pofTreeUpdate(this.props.activities)
  }

  filterTreeNode = (input, child) =>
    child.props.title.props.name.toLowerCase().includes(input.toLowerCase())
  isLeaf = value => {
    if (!value) {
      return false
    }
    return this.props.pofTree.entities.activities[value] !== undefined
  }

  updateStatusMessage = () => {
    if (!this.props.taskgroup) {
      this.props.addStatusMessage(1)
    } else if (
      this.props.buffer.activities &&
      this.props.buffer.activities.length !== 0
    ) {
      this.props.addStatusMessage(2)
    } else {
      this.props.addStatusMessage(3)
    }
  }

  render() {
    if (!this.props.pofTree) return <div />
    const taskGroupTree = getRootGroup(this.props.pofTree)
    if (!taskGroupTree) return <div />
    let selectedTaskGroupPofData = []
    if (this.props.taskgroup !== undefined && this.props.taskgroup !== null) {
      const groupfound = getTaskGroup(
        this.props.taskgroup.guid,
        this.props.pofTree
      )
      selectedTaskGroupPofData = selectedTaskGroupPofData.concat(
        groupfound.tasks
      )

      selectedTaskGroupPofData = selectedTaskGroupPofData.concat(
        groupfound.taskgroups
      )
    }
    const treeSearchBar = () => (
      <TreeSelect
        style={{ width: '100%' }}
        dropdownStyle={{
          position: 'absolute',
          maxHeight: 400,
          overflow: 'auto',
        }}
        placeholder={this.state.treePlaceHolder}
        searchPlaceholder="Hae aktiviteettia"
        showSearch
        allowClear
        treeLine
        getPopupContainer={() => ReactDOM.findDOMNode(this).parentNode}
        value={this.state.value}
        treeData={selectedTaskGroupPofData}
        treeNodeFilterProp="label"
        filterTreeNode={this.filterTreeNode}
        onChange={this.onChangeChildren}
      />
    )
    return (
      <div
        style={{
          margin: 10,
          padding: 10,
          backgroundColor: '#d6e8f7',
          borderRadius: 3,
        }}
      >
        <div style={{ float: 'left', marginRight: 10, marginBottom: 5 }}>
          <Select
            menuContainerStyle={{ width: '100%' }}
            style={{ width: 200 }}
            name="form-field-name"
            value={this.props.taskgroup}
            placeholder="Valitse tarppo..."
            onChange={this.onChangeTaskgroup}
            options={taskGroupTree.map(rootgroup => {
              const status = createStatusMessage(
                this.props.events,
                this.props.pofTree,
                rootgroup,
                this.props.activities
              )
              let labelText = rootgroup.title

              if (status.taskgroupDone) {
                labelText = (
                  <span style={{ textDecoration: 'line-through' }}>
                    {labelText}
                  </span>
                )
              }

              return {
                value: rootgroup,
                label: labelText,
              }
            })}
          />
        </div>
        <div style={{ width: '80%' }}>
          {this.props.taskgroup ? treeSearchBar() : null}
        </div>
      </div>
    )
  }
}

TreeSearchBar.propTypes = {
  buffer: PropTypesSchema.bufferShape.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  pofTree: PropTypesSchema.pofTreeShape.isRequired,
  taskgroup: PropTypesSchema.taskgroupShape.isRequired,
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  notify: PropTypes.func.isRequired,
  postActivityToBuffer: PropTypes.func.isRequired,
  addActivity: PropTypes.func.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
  addStatusMessage: PropTypes.func.isRequired,
  selectTaskgroup: PropTypes.func.isRequired,
  emptyTaskgroup: PropTypes.func.isRequired,
}

TreeSearchBar.defaultProps = {}

const mapStateToProps = state => ({
  events: state.events,
  buffer: state.buffer,
  pofTree: state.pofTree,
  taskgroup: state.taskgroup,
  activities: state.activities,
})

const mapDispatchToProps = {
  notify,
  postActivityToBuffer,
  addActivity,
  pofTreeUpdate,
  addStatusMessage,
  selectTaskgroup,
  emptyTaskgroup,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeSearchBar)
