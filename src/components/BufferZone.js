import { connect } from 'react-redux'
import React from 'react'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Activity from './Activity'
import ItemTypes from '../ItemTypes'
import { notify } from '../reducers/notificationReducer'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { postActivityToBufferOnlyLocally, deleteActivityFromBufferOnlyLocally, deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import { deleteActivityFromEventOnlyLocally, addActivityToEventOnlyLocally } from '../reducers/eventReducer'
import activityService from '../services/activities'
import convertToSimpleActivity from '../functions/activityConverter'
import findActivity from '../functions/findActivity'

const moveActivity = async (
  props,
  activity,
  parentId,
  targetId,
  bufferzone
) => {
  const activityId = activity.id
  try {
    // Move activity locally
    props.postActivityToBufferOnlyLocally(activity)
    props.deleteActivityFromEventOnlyLocally(activityId)
    const res = await activityService.moveActivityFromEventToBufferZone(
      activityId,
      parentId
    )
    // Replace the moved activity (res )
    await props.deleteActivityFromBufferOnlyLocally(activityId)
    props.postActivityToBufferOnlyLocally(res)

    props.notify('Aktiviteetti siirretty!', 'success')
    return res
  } catch (exception) {
    props.deleteActivityFromBufferOnlyLocally(activityId)
    props.addActivityToEventOnlyLocally(parentId, { ...activity, canDrag: true })
    if (!bufferzone || parentId !== targetId) {
      props.notify('Aktiviteettialue on täynnä!')
    }
  }
  props.pofTreeUpdate(props.buffer, props.events)
}

const bufferZoneTarget = {
  drop(props, monitor) {
    const item = monitor.getItem()
    const targetId = 1
    const { parentId, bufferzone } = item
    const activity = { ...item.activity }
    if (!bufferzone) {
      moveActivity(props, activity, parentId, targetId, bufferzone)
    }
  }
}

function collect(connector, monitor) {
  return {
    connectDropTarget: connector.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    target: monitor.getItem()
  }
}

class BufferZone extends React.Component {
  static propTypes = {
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired
  }

  handleClick = async () => {
    const bufferActivities = this.props.buffer.activities

    const promises = bufferActivities.map(activity =>
      this.props.deleteActivityFromBuffer(activity.id)
    )

    try {
      await Promise.all(promises)
      this.props.pofTreeUpdate(this.props.buffer, this.props.events)
      this.props.notify('Aktiviteetit poistettu!', 'success')
    } catch (exception) {
      this.props.notify('Kaikkia aktiviteetteja ei voitu poistaa!')
    }
  }

  deleteActivity = async activity => {
    try {
      await this.props.deleteActivityFromBuffer(activity.id)
      this.props.pofTreeUpdate(this.props.buffer, this.props.events)
      this.props.notify('Aktiviteetti poistettu!', 'success')
    } catch (exception) {
      this.props.notify(
        'Aktiviteetin poistossa tapahtui virhe! Yritä uudestaan!'
      )
    }
  }

  render() {
    const { isOver, canDrop, connectDropTarget } = this.props
    if (
      !this.props.buffer.activities ||
      this.props.buffer.activities.length === 0
    ) {
      return connectDropTarget(<div id="bufferzone" />)
    }

    const rows = this.props.buffer.activities.map(activity => {
      const pofActivity = convertToSimpleActivity(
        findActivity(activity, this.props.pofTree)
      )
      return pofActivity === null ? (
        undefined
      ) : (
        <Activity
          deleteActivity={this.deleteActivity}
          bufferzone="true"
          parentId={this.props.buffer.id}
          parent={this}
          key={activity.id}
          pofActivity={pofActivity}
          activity={activity}
        />
      )
    })
    let patternClass
    let background = { backgroundColor: '#FFF' }
    if (canDrop) {
      background = { backgroundColor: '#C8E6C9' }
    }
    if (isOver) {
      patternClass = 'pattern'
    }

    return connectDropTarget(
      <div>
        <div id="bufferzone" style={background} className={patternClass}>
          {rows}
        </div>
        <div>
          <Button onClick={this.handleClick}> Tyhjennä </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    buffer: state.buffer,
    events: state.events,
    pofTree: state.pofTree
  }
}

const DroppableBufferZone = DropTarget(
  ItemTypes.ACTIVITY,
  bufferZoneTarget,
  collect
)(BufferZone)

export default connect(mapStateToProps, {
  notify,
  deleteActivityFromEventOnlyLocally,
  addActivityToEventOnlyLocally,
  deleteActivityFromBufferOnlyLocally,
  postActivityToBufferOnlyLocally,
  pofTreeUpdate,
  deleteActivityFromBuffer
})(DroppableBufferZone)
