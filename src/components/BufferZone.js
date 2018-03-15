import React from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types'
import Activity from './Activity'
<<<<<<< HEAD
import ItemTypes from '../ItemTypes'
=======
import {connect} from 'react-redux'
import {notify} from '../reducers/notificationReducer'

const Types = {
    ACTIVITY: 'activity'
}
>>>>>>> master

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
        canDrop: monitor.canDrop()
    }
}


class BufferZone extends React.Component {
    static propTypes = {
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
        connectDropTarget: PropTypes.func.isRequired
    }

    render() {
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
<<<<<<< HEAD
            const act = this.props.activities.filter(a => a.guid === activity.guid);
              return <Activity parentId={this.props.bufferZoneActivities.id} parent={this} key={activity.id} act={act} activity={activity} delete={this.props.deleteFromBufferZone} />
=======
            const act = this.props.pofActivities.filter(a => a.guid === activity.guid);
              return <Activity key={activity.id} act={act} activity={activity} delete={this.props.deleteFromBufferZone} />
>>>>>>> master
        })
          return connectDropTarget(
            <div id="bufferzone">
              <div className="bufferzone-activities">{rows}</div>
              {isOver && canDrop && <div className='green' />}
              {!isOver && canDrop && <div className='yellow' />}
              {isOver && !canDrop && <div className='red' />}
            </div>
            )
        }
}

<<<<<<< HEAD
export default DropTarget(ItemTypes.ACTIVITY, bufferZoneTarget, collect)(BufferZone)
=======
const mapStateToProps = (state) => {
    return {
      pofActivities: state.pofActivities
    }
  }

export default DropTarget(Types.ACTIVITY, bufferZoneTarget, collect)(
    connect(
        mapStateToProps,
        { notify }
      
      )(BufferZone)
)
>>>>>>> master
