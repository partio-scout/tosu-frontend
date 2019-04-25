import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import TreeSelect from 'rc-tree-select'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { postActivityToBuffer } from '../reducers/bufferZoneReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { addStatusMessage } from '../reducers/statusMessageReducer'
import { selectTaskgroup, emptyTaskgroup } from '../reducers/taskgroupReducer'
import { createStatusMessage } from '../utils/createStatusMessage'
import { getTaskGroup, getRootGroup } from '../functions/denormalizations'
import { eventList } from '../reducers/eventReducer'
import { addActivity } from '../reducers/activityReducer'
import { addActivityToRelevantReducers } from '../functions/activityFunctions'
import PropTypesSchema from '../utils/PropTypesSchema'
import { withStyles } from '@material-ui/core'

const styles = {
  treeSearchBar: {
    padding: 10,
    backgroundColor: '#d6e8f7',
    borderRadius: 3,
  },
  treeSelect: {
    width: '100%',
    marginTop: 5,
  },
}

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
        this.props.enqueueSnackbar('Aktiviteetti lisätty', { variant: 'info' })
      } catch (exception) {
        this.props.enqueueSnackbar('Aktiviteettialue on täynnä!', {
          variant: 'warning',
        })
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

        this.props.enqueueSnackbar('Pakolliset aktiviteetit lisätty', {
          variant: 'info',
        })
        this.props.pofTreeUpdate(this.props.activities)
      } catch (exception) {
        this.props.enqueueSnackbar(
          'Kaikki pakolliset aktiviiteetit eivät mahtuneet alueelle!',
          { variant: 'warning' }
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
      this.props.addStatusMessage()
    }
  }

  render() {
    const { classes } = this.props

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
        className={classes.treeSelect}
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
      <div className={classes.treeSearchBar}>
        <div id="select-tarppo">
          <Select
            menuContainerStyle={{ width: '100%' }}
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
        {this.props.taskgroup ? treeSearchBar() : null}
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
  enqueueSnackbar: PropTypes.func.isRequired,
  postActivityToBuffer: PropTypes.func.isRequired,
  addActivity: PropTypes.func.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
  addStatusMessage: PropTypes.func.isRequired,
  selectTaskgroup: PropTypes.func.isRequired,
  emptyTaskgroup: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  events: state.events,
  buffer: state.buffer,
  pofTree: state.pofTree,
  taskgroup: state.taskgroup,
  activities: state.activities,
})

const mapDispatchToProps = {
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
)(withStyles(styles)(withSnackbar(TreeSearchBar)))
