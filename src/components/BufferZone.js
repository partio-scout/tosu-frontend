import { connect } from 'react-redux'
import React from 'react'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import Divider from '@material-ui/core/Divider/Divider'
import { withStyles } from '@material-ui/core/styles'
import ActivityDragAndDropTarget from './ActivityDragAndDropTarget'
import Activities from './Activities'
import { notify } from '../reducers/notificationReducer' 
import { pofTreeUpdate } from '../reducers/pofTreeReducer'
import { deleteActivityFromBufferOnlyLocally, deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'

const styles = theme => ({
  button: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 14,
  },
  divider: {
    height: 4,
    backgroundColor: '#243265',
    marginBottom: '20px',
    marginTop: '20px'
  }
})

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
    const { classes } = this.props
    if (! this.props.buffer.id){
      return ( <div /> )
    }
    if (this.props.buffer.activities.length === 0) {
      return ( <div /> )
    }
    return (
      <div>
        <ActivityDragAndDropTarget bufferzone parentId={this.props.buffer.id}>
          <div id='bufferzone'>
            <Activities
              activities={this.props.buffer.activities}
              bufferzone
              parentId={this.props.buffer.id} 
            />
          </div>
          <Button id='empty-button' color='primary' onClick={this.clear}>
            Tyhjennä
              <Icon>clear</Icon>
          </Button>
        </ActivityDragAndDropTarget>
        <Divider variant={'middle'} className={classes.divider}/>
      </div>
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
})(withStyles(styles)(BufferZone))
