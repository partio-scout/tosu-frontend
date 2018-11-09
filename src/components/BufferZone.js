import { connect } from 'react-redux'
import React from 'react'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import Activities from './Activities'
import { notify } from '../reducers/notificationReducer' 
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { deleteActivityFromBufferOnlyLocally, deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'


class BufferZone extends React.Component {
  clear = async () => {
    if (this.props.buffer.activities){
      const promises = this.props.buffer.activities.map(activity =>  this.props.deleteActivityFromBuffer(activity.id))
      try {
        await Promise.all(promises)
        this.props.pofTreeUpdate(this.props.buffer, this.props.events)
        this.props.notify('Aktiviteetit poistettu!', 'success')
      } catch (exception) {
        this.props.notify('Kaikkia aktiviteetteja ei voitu poistaa!')
      }
    }
  }

  render() {
    if (! this.props.buffer.id){
      return ( <div /> )
    }
    if (this.props.buffer.activities.length === 0) {
      return ( <div /> )
    }
    return (
      <ActivityDragAndDropTarget bufferzone parentId={this.props.buffer.id}>
        <div id="bufferzone">
          <Activities
            activities={this.props.buffer.activities}
            bufferzone
            parentId={this.props.buffer.id} 
          />
        </div>
        <Button id="empty-button" variant="outlined" color="secondary" onClick={this.clear}>
          Tyhjennä
          <DeleteIcon />
        </Button>
      </ActivityDragAndDropTarget>
    )
  }
}

const mapStateToProps = state => ({
    buffer: state.buffer,
    events: state.events,
    pofTree: state.pofTree,
  })

export default connect(mapStateToProps, {
  notify,
  pofTreeUpdate,
  deleteActivityFromBufferOnlyLocally,
  deleteActivityFromBuffer,
})(BufferZone)
