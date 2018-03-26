import { connect } from 'react-redux'
import React from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types'
import Activity from './Activity'
import ItemTypes from '../ItemTypes'
import { notify } from '../reducers/notificationReducer'
import { postActivityToBufferOnlyLocally } from '../reducers/bufferZoneReducer'
import { deleteActivityFromEventOnlyLocally } from '../reducers/eventReducer'
import activityService from '../services/activities'
import { white, green100 } from 'material-ui/styles/colors';
import { componentWillAppendToBody } from "react-append-to-body";

const moveActivity = async (props, activityId, parentId, targetId) => {
    try {
        const res = await activityService.moveActivityFromEventToBufferZone(activityId, parentId, targetId)
        props.deleteActivityFromEventOnlyLocally(activityId)
        props.postActivityToBufferOnlyLocally(res)
        return res
    } catch (exception) {
        props.notify('Aktiviteettialue on täynnä!')
    }
}

const bufferZoneTarget = {
    drop(props, monitor) {
        const item = monitor.getItem()
        const targetId = 1
        const { parentId } = item
        const activityId = item.id
        moveActivity(props, activityId, parentId, targetId)
        console.log('adssff')
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

    render() {
        const { isOver, canDrop, connectDropTarget } = this.props
        if (!this.props.buffer.activities || this.props.buffer.activities.length === 0) {
            return connectDropTarget(
              <div id="bufferzone" />
            )
        }

        const rows = this.props.buffer.activities.map(activity => {
            const act = this.props.pofActivities.filter(a => a.guid === activity.guid);
            return <Activity bufferzone='true' parentId={this.props.buffer.id} parent={this} key={activity.id} act={act} activity={activity} delete={this.props.deleteFromBufferZone} />
        })
        let patternClass
        let background = { backgroundColor: white }
        if (canDrop) {
          background = { backgroundColor: green100 }
        }
        if (isOver) {
          patternClass = 'pattern'
        }
        return connectDropTarget(
          <div id="bufferzone" style={background} className={patternClass}>
            {rows} 
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
    {
        notify,
        deleteActivityFromEventOnlyLocally,
        postActivityToBufferOnlyLocally
    }
)(DroppableBufferZone)
