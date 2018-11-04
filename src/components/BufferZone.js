import { connect } from 'react-redux'
import React from 'react'
import Button from '@material-ui/core/Button'
import ActivityDragAndDropArea from './ActivityDragAndDropArea'
import ActivityWrapper from './ActivityWrapper'


class BufferZone extends React.Component {
  constructor(props){
    super(props)
    this.activityDragAndDropArea = React.createRef()
  }


  render() {
    if (! this.props.buffer.id){
      return ( <div /> )
    }
    return (
      <ActivityDragAndDropArea ref={this.activityDragAndDropArea} bufferzone parentId={this.props.buffer.id}>
        <div id="bufferzone">
          <ActivityWrapper
            activities={this.props.buffer.activities}
            bufferzone
            parentId={this.props.buffer.id} 
          />
        </div>
        <div>
          <Button onClick={this.activityDragAndDropArea.clear}> Tyhjennä </Button>
        </div>
      </ActivityDragAndDropArea>
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


export default connect(mapStateToProps, {})(BufferZone)
