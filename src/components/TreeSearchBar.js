import React from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import PropTypes from 'prop-types'
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
        await this.props.postActivityToBuffer({ guid: activityGuid })
        this.props.notify('Aktiviteetti on lisätty!', 'success')
      } catch (exception) {
        this.props.notify('Aktiviteettialue on täynnä!!')
      }
    }
    this.props.pofTreeUpdate(this.props.buffer, this.props.events)
  }

  onChangeTaskgroup = async taskgroup => {
    if (taskgroup === null) {
      this.setState({ treePlaceHolder: 'Valitse ensin tarppo' })
      this.props.addStatusMessage('Valitse ensin tarppo!')
      this.props.emptyTaskgroup()

      return
    }
    const selectedGroup = this.props.pofTree.entities.tarppo[
      taskgroup.value.guid
    ]
    selectedGroup.tasks = selectedGroup.tasks.map(activity => {
      const tempActi = this.props.pofTree.entities.activities[activity]
      if( tempActi) {
      tempActi.suggestions_details = tempActi.suggestions_details.map(key => {
        return this.props.pofTree.entities.suggestions[key]
      }) }
      return tempActi
    })
    this.props.selectTaskgroup(selectedGroup)

    this.updateStatusMessage()

    this.setState({ treePlaceHolder: 'Lisää aktiviteetti' })

    const mandatoryActivities = selectedGroup.mandatory_tasks.split(',')
    if (mandatoryActivities[0] !== '') {
      // empty split return and array with only value as ''

      let activities = []
      this.props.buffer.activities.forEach(activity => {
        activities = activities.concat(activity.guid)
      })
      this.props.events.forEach(event => {
        event.activities.forEach(activity => {
          activities = activities.concat(activity.guid)
        })
      })

      const promises = mandatoryActivities.map(activity =>
        activities.includes(activity)
          ? null
          : this.props.postActivityToBuffer({ guid: activity })
      )
      try {
        await Promise.all(promises)
        this.props.notify(
          'Pakolliset aktiviteetit lisätty tai olemassa!',
          'success'
        )
      } catch (exception) {
        this.props.notify(
          'Kaikki pakolliset aktiviiteetit eivät mahtuneet alueelle tai ovat jo lisätty!'
        )
      }
    }
    this.props.pofTreeUpdate(this.props.buffer, this.props.events)
  }

  filterTreeNode = (input, child) =>
    child.props.title.props.name.toLowerCase().includes(input.toLowerCase())
  isLeaf = value => {
    if (!value) {
      return false
    }
    let queues = [...this.props.pofTree.taskgroups]
    while (queues.length) {
      // BFS
      const item = queues.shift()
      if (item.value.toString() === value.toString()) {
        if (!item.children) {
          return true
        }
        return false
      }
      if (item.children) {
        queues = queues.concat(item.children)
      }
    }
    return false
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
    try {
      const poftreeGuid = Object.keys(this.props.pofTree.entities.poftree)[0]
      const pofdata = this.props.pofTree.entities.poftree[
        poftreeGuid
      ]
      const taskGroupTreeKeys = pofdata.taskgroups
      const taskGroupTree = taskGroupTreeKeys
        .map(key => {
          return this.props.pofTree.entities.tarppo[key]
        })
        .map(taskGroup => {
          const tasks = taskGroup.tasks.map(key => {
            return this.props.pofTree.entities.activities[key]
          })
          const newGroup = Object.assign({}, taskGroup)
          newGroup.tasks = tasks
          return newGroup
        })

      let selectedTaskGroupPofData = []
      if (this.props.taskgroup !== undefined && this.props.taskgroup !== null) {
        const groupfound = this.props.pofTree.entities.tarppo[
          this.props.taskgroup.guid
        ]
        groupfound.tasks = groupfound.tasks.map(key => ( this.props.pofTree.entities.activities[key]))
        selectedTaskGroupPofData = selectedTaskGroupPofData.concat(
          groupfound.tasks
        )
        console.log(groupfound)
      }
      const treeSearchBar = () => (
        <TreeSelect
          style={{ width: '100%' }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
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
            borderRadius: 2,
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
                  rootgroup
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
    } catch (err) {
      console.log(err)
      return null
    }
  }
}

TreeSearchBar.propTypes = {
  addStatusMessage: PropTypes.func.isRequired,
  buffer: PropTypes.shape({
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  emptyTaskgroup: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  notify: PropTypes.func.isRequired,
  pofTree: PropTypes.object.isRequired,
  pofTreeUpdate: PropTypes.func.isRequired,
  postActivityToBuffer: PropTypes.func.isRequired,
  selectTaskgroup: PropTypes.func.isRequired,
  taskgroup: PropTypes.shape({
    value: PropTypes.number.isRequired,
  }).isRequired,
}

const mapStateToProps = state => ({
  events: state.events,
  buffer: state.buffer,
  pofTree: state.pofTree,
  taskgroup: state.taskgroup,
})

export default connect(
  mapStateToProps,
  {
    notify,
    postActivityToBuffer,
    pofTreeUpdate,
    addStatusMessage,
    selectTaskgroup,
    emptyTaskgroup,
  }
)(TreeSearchBar)
