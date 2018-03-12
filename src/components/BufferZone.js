import React from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types'
import Activity from './Activity';
import activitiesArray from '../utils/NormalizeActivitiesData';
import activityService from '../services/activities'

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

    state = {
        bufferZoneActivities: []
    }

    componentDidMount() {
        this.getBufferZoneActivities()
    }

    getBufferZoneActivities = async () => {
        try {
            const bufferZoneActivities = await activityService.getBufferZoneActivities()
            this.setState({
                bufferZoneActivities
            })
        } catch (exception) {
            console.error(exception)
        }
    }

    render() {
        const { position } = this.props
        // console.log(position)
        const { isOver, canDrop, connectDropTarget } = this.props
        if (this.state.bufferZoneActivities.length === 0) {
            return connectDropTarget(
              <div id="bufferzone">
                {isOver && canDrop && <div className='green' />}
                {!isOver && canDrop && <div className='yellow' />}
                {isOver && !canDrop && <div className='red' />}
              </div>
            )
        } 
          return connectDropTarget(
            <div id="bufferzone">
              <Activity
                eventActivities={this.state.bufferZoneActivities.activities}
                dataSource={this.props.activities}
              />
              {isOver && canDrop && <div className='green' />}
              {!isOver && canDrop && <div className='yellow' />}
              {isOver && !canDrop && <div className='red' />}
            </div>
            )
        }
}

export default DropTarget(Types.ACTIVITY, bufferZoneTarget, collect)(BufferZone)