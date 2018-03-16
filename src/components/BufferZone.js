import React from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types'
import Activity from './Activity'
import {connect} from 'react-redux'
import {notify} from '../reducers/notificationReducer'

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
    //    console.log(this.props)
        // const { position } = this.props
        // console.log(position)
        const { isOver, canDrop, connectDropTarget } = this.props
        if (!this.props.buffer.activities || this.props.buffer.activities.length === 0) {
            return connectDropTarget(
              <div id="bufferzone">
                {isOver && canDrop && <div className='green' />}
                {!isOver && canDrop && <div className='yellow' />}
                {isOver && !canDrop && <div className='red' />}
              </div>
            )
        }
       
        const rows = this.props.buffer.activities.map(activity => {
            const act = this.props.pofActivities.filter(a => a.guid === activity.guid);
              return <Activity key={activity.id} act={act} activity={activity} delete={this.props.deleteFromBufferZone} />
        })
        // const rows = ActivityMapper(activities, this.props.activities)
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

const mapStateToProps = (state) => {
    return {
      pofActivities: state.pofActivities,
      buffer: state.buffer,
      events: state.events
    }
  }

export default DropTarget(Types.ACTIVITY, bufferZoneTarget, collect)(
    connect(
        mapStateToProps,
        { notify }
      
      )(BufferZone)
)