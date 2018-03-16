import React from 'react'
import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import { blue300, red300, indigo900, red900 } from 'material-ui/styles/colors'
import { deleteActivityFromEvent } from '../reducers/eventReducer'
import { deleteActivityFromBuffer } from '../reducers/bufferZoneReducer'
import { connect } from 'react-redux'

const styles = {
  chip: {
    margin: 4,
    float: 'left',
    backgroundColor: blue300
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
    backgroundColor: red300
  },
  avatarMandatory: {
    size: 28,
    color: red900,
    backgroundColor: red300,
    margin: 4
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
  }
}

const Activity = props => {
  const { activity, act } = props
  if (activity && act[0]) {
    console.log('Activity', act[0])

    if (act[0].mandatory) {
      return (
        <Chip
          onRequestDelete={() => handleRequestDelete(activity, props)}
          style={styles.chipMandatory}
          key={activity.id}
        >
          <Avatar style={styles.avatarMandatory}>
            <img
              style={{ width: '100%' }}
              src="https://pof-backend.partio.fi/wp-content/uploads/2015/03/g3538.png"
              alt="Mandatory activity"
            />
          </Avatar>
          <span className="activityTitle">{act[0].title}</span>
        </Chip>
      )
    }
    return (
      <Chip
        onRequestDelete={() => handleRequestDelete(activity, props)}
        style={styles.chip}
        key={activity.id}
      >
        <Avatar style={styles.avatar}>
          <img
            style={{ width: '100%' }}
            src="https://pof-backend.partio.fi/wp-content/uploads/2015/03/g3562.png"
            alt="Not-mandatory activity"
          />
        </Avatar>
        <span className="activityTitle">{act[0].title}</span>
      </Chip>
    )
  }
  return <div />
}

const mapStateToProps = state => {
  return {
    notification: state.notification,
    buffer: state.buffer
  }
}
export default connect(mapStateToProps, {
  deleteActivityFromEvent,
  deleteActivityFromBuffer
})(Activity)
