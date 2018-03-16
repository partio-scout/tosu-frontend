import { connect } from 'react-redux'
import React from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types'
import Activity from './Activity'
import ItemTypes from '../ItemTypes'
import { notify } from '../reducers/notificationReducer'
import activityService from '../services/activities'

const MoveActivity = async (activityId, parentId, targetId) => {
    const res = await activityService.moveActivityFromEventToBufferZone(activityId, parentId, targetId)
    return res
}

const bufferZoneTarget = {
    drop(props, monitor) {
        const item = monitor.getItem()
        const targetId = 1
        const { parentId } = item
        const activityId = item.id
        console.log('parent: ', parentId)
        console.log('target: ', targetId)
        console.log('id: ', activityId)
        const res = MoveActivity(activityId, parentId, targetId)
        console.log(res)
    }
}

function collect(connector, monitor) {
    return {
        connectDropTarget: connector.dropTarget(),
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
            return <Activity parentId={this.props.buffer.id} parent={this} key={activity.id} act={act} activity={activity} delete={this.props.deleteFromBufferZone} />
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

const mapStateToProps = (state) => {
    return {
        pofActivities: state.pofActivities,
        buffer: state.buffer,
        events: state.events
    }
}

const DroppableBufferZone = DropTarget(ItemTypes.ACTIVITY, bufferZoneTarget, collect)(BufferZone)

export default connect(
    mapStateToProps,
    { notify }
)(DroppableBufferZone)

