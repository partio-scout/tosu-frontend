import { connect } from 'react-redux'
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import React from 'react';
import { white, green100 } from 'material-ui/styles/colors';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types'
import Activity from './Activity'
import ItemTypes from '../ItemTypes'
import { notify } from '../reducers/notificationReducer'
import { postActivityToBufferOnlyLocally } from '../reducers/bufferZoneReducer'
import { deleteActivityFromEventOnlyLocally } from '../reducers/eventReducer'
import activityService from '../services/activities'
import FlatButton from 'material-ui/FlatButton';
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import convertToSimpleActivity from '../functions/activityConverter'
import findActivity from '../functions/findActivity'

const moveActivity = async (props, activityId, parentId, targetId, bufferzone) => {
    try {
        const res = await activityService.moveActivityFromEventToBufferZone(activityId, parentId, targetId)
        props.deleteActivityFromEventOnlyLocally(activityId)
        props.postActivityToBufferOnlyLocally(res)
        props.notify('Aktiviteetti siirretty!', 'success')
        return res
    } catch (exception) {
        if(bufferzone && parentId === targetId) {
            
        } else {
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
        const activityId = item.id
        moveActivity(props, activityId, parentId, targetId, bufferzone)
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

    handleClick = async() => {
        const bufferActivities = this.props.buffer.activities
        
        const promises = bufferActivities.map(activity => {
            this.props.deleteActivityFromBuffer(activity.id)
        })

        try {
            await Promise.all(promises)
            this.props.notify('Aktiviteetit poistettu!', 'success')
        } catch (exception) {
                this.props.notify('Kaikkia aktiviteetteja ei voitu poistaa!')
        }

    }

    render() {
        
        const { isOver, canDrop, connectDropTarget } = this.props
        if (!this.props.buffer.activities || this.props.buffer.activities.length === 0) {
            return connectDropTarget(
                <div id="bufferzone" />
            )
        }

        const rows = this.props.buffer.activities.map(activity => {
            const pofActivity = convertToSimpleActivity(findActivity(activity, this.props.pofTree))
        
            return pofActivity === null ? undefined :
                <Activity
                    deleteActivity={this.deleteActivity}
                    bufferzone='true'
                    parentId={this.props.buffer.id}
                    parent={this}
                    key={activity.id}
                    pofActivity={pofActivity}
                    activity={activity}
                    delete={this.props.deleteFromBufferZone}
                />
        })
        console.log(rows)
        let patternClass
        let background = { backgroundColor: white }
        if (canDrop) {
          background = { backgroundColor: green100 }
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
                    <FlatButton label="Tyhjennä"
                    onClick={this.handleClick}
                    />
                </div>
            </div>
        )    
    }
}


const mapStateToProps = (state) => {
    return {
        pofActivities: state.pofActivities,
        buffer: state.buffer,
        events: state.events,
        pofTree: state.pofTree
    }
}

const DroppableBufferZone = DropTarget(ItemTypes.ACTIVITY, bufferZoneTarget, collect)(BufferZone)

export default connect(
    mapStateToProps,
    {
        notify,
        deleteActivityFromEventOnlyLocally,
        postActivityToBufferOnlyLocally,
        pofTreeUpdate,
        deleteActivityFromBuffer
    }
)(DroppableBufferZone)
