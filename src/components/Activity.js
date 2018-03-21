import { connect } from 'react-redux'
import { notify } from '../reducers/notificationReducer'
import { DragSource } from 'react-dnd'
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip'
import { blue300, red300, indigo900, red900 } from 'material-ui/styles/colors'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import ItemTypes from '../ItemTypes'
import Dialog from 'material-ui/Dialog';
import PlanForm from './PlanForm';


const styles = {
  chip: {
    margin: 4,
    float: 'left',
    backgroundColor: blue300,
    cursor: 'move'
  },
  avatar: {
    size: 28,
    color: indigo900,
    backgroundColor: blue300,
    margin: 4
  },
  chipMandatory: {
    margin: 4,
    float: 'left',
    backgroundColor: red300,
    cursor: 'move'
  },
  avatarMandatory: {
    size: 28,
    color: red900,
    backgroundColor: red300,
    margin: 4
  }
};

const activitySource = {
  beginDrag(props) {
    return {
      id: props.activity.id,
      parent: props.parent.constructor.name,
      parentId: props.parentId,
      bufferzone: props.bufferzone
    }
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return
    }
    const activity = monitor.getItem()
    const dropResult = monitor.getDropResult()
    console.log(`activity: ${activity} result: ${dropResult}`)
  }
}

function collect(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    connectDragPreview: connector.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const handleRequestDelete = async (activity, props) => {
  try {
    if (
      props.buffer.activities.find(
        a => a.id.toString() === activity.id.toString()
      ) !== undefined
    ) {
      props.deleteActivityFromBuffer(activity.id)
    } else {
      props.deleteActivityFromEvent(activity.id)
    }
  } catch (exception) {
    console.error('Error in deleting activity:', exception)
    props.notify('Aktiviteetin poistossa tapahtui virhe! Yritä uudestaan!')
  }
}

class Activity extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired


  }

  constructor(props) {
      super(props);
    
      this.state = {
        open: false
      }
  }
  componentDidMount() {
    const img = new Image()
    img.src = 'data:image/png;base64,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'
    img.onload = () => this.props.connectDragPreview(img)
  }

  handleClick = () => {
    this.setState({open: !this.state.open})
  }

  render() {
    const { activity, act } = this.props
    const { connectDragSource } = this.props
    if (activity && act[0]) {
      
      if (act[0].mandatory) {

        return connectDragSource(
          <div>
            <Chip
              onRequestDelete={() => handleRequestDelete(activity, this.props)}
              style={styles.chipMandatory}
              key={activity.id}
              onClick={this.handleClick}
            >
              <Avatar style={styles.avatarMandatory}>
                <img
                  style={{ width: '100%' }}
                  src="https://pof-backend.partio.fi/wp-content/uploads/2015/03/g3538.png"
                  alt="Mandatory activity"
                />
              </Avatar>
              <span className="activityTitle">{act[0].title}</span>
              <Dialog
              title={act[0].title}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClick}
              autoScrollBodyContent
            >
            <PlanForm
              activity={act[0]}
              savedActivity={activity}
            />
        </Dialog>
            </Chip>
          </div>
        )
      }
      return connectDragSource(
        <div>
          <Chip
            onRequestDelete={() => handleRequestDelete(activity, this.props)}
            style={styles.chip}
            key={activity.id}
            onClick={this.handleClick}
          >
            <Avatar style={styles.avatar}>
              <img
                style={{ width: '100%' }}
                src="https://pof-backend.partio.fi/wp-content/uploads/2015/03/g3562.png"
                alt="Not-mandatory activity"
              />
            </Avatar>
            <span className="activityTitle">{act[0].title}</span>
            <Dialog
              title={act[0].title}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClick}
              autoScrollBodyContent
            >
            <PlanForm
              activity={act[0]}
              savedActivity={activity}
            />
        </Dialog>
          </Chip>
        </div>
      )
    }
    return <div />

  }

}

const DraggableActivity = DragSource(ItemTypes.ACTIVITY, activitySource, collect)(Activity)

const mapStateToProps = state => {
  return {
    notification: state.notification,
    buffer: state.buffer
  }
}
export default connect(
  mapStateToProps,
  { deleteActivityFromEvent, deleteActivityFromBuffer, notify }

)(DraggableActivity)
