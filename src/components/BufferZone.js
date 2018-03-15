import React from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types'
import Activity from './Activity'

const Types = {
    ACTIVITY: 'activity'
}

const bufferZoneTarget = {
    canDrop() {
        return 'success'
    },
    drop() {
        return 'ok'
    }

}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    }
}


class BufferZone extends React.Component {
    static propTypes = {
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
        connectDropTarget: PropTypes.func.isRequired
    }

    render() {
        // const { position } = this.props
        // console.log(position)
        const { isOver, canDrop, connectDropTarget } = this.props
        if (!this.props.bufferZoneActivities || this.props.bufferZoneActivities.length === 0) {
            return connectDropTarget(
              <div id="bufferzone">
                {isOver && canDrop && <div className='green' />}
                {!isOver && canDrop && <div className='yellow' />}
                {isOver && !canDrop && <div className='red' />}
              </div>
            )
        }
        const rows = this.props.bufferZoneActivities.activities.map(activity => {
            const act = this.props.activities.filter(a => a.guid === activity.guid);
              return <Activity key={activity.id} act={act} activity={activity} delete={this.props.deleteFromBufferZone} />
        })
        // const rows = ActivityMapper(activities, this.props.activities)
          return connectDropTarget(
            <div id="bufferzone">
              {rows}
              {isOver && canDrop && <div className='green' />}
              {!isOver && canDrop && <div className='yellow' />}
              {isOver && !canDrop && <div className='red' />}
            </div>
            )
        }
}

export default DropTarget(Types.ACTIVITY, bufferZoneTarget, collect)(BufferZone)