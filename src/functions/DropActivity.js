import activityService from '../services/activities'

// These functions looked so ugly that I moved them to their own file :3

const moveActivityFromEventToBuffer = async (props, activity, parentId) => {
  const activityId = activity.id
  try {
    // Move activity locally
    props.postActivityToBufferOnlyLocally(activity)
    props.deleteActivityFromEventOnlyLocally(activityId, parentId)
    const res = await activityService.moveActivityFromEventToBufferZone(
      activityId,
      parentId
    )
    // Replace the moved activity (res )
    props.updateActivity(res)
    return res
  } catch (exception) {
    props.deleteActivityFromBufferOnlyLocally(activityId)
    props.addActivityToEventOnlyLocally(parentId, {
      ...activity,
      canDrag: true,
    })
    console.log(exception)
  }
  props.pofTreeUpdate(props.activities)
}

const moveActivityFromBufferToEvent = async (props, activity, targetId) => {
  const activityId = activity.id
  try {
    props.addActivityToEventOnlyLocally(targetId, activity)
    props.deleteActivityFromBufferOnlyLocally(activityId)
    const res = await activityService.moveActivityFromBufferZoneToEvent(
      activityId,
      targetId
    )
    props.updateActivity(res)
    return res
  } catch (exception) {
    props.deleteActivityFromEventOnlyLocally(activityId, activity.eventId)
    props.postActivityToBufferOnlyLocally({ ...activity, canDrag: true })
  }
  props.pofTreeUpdate(props.activities)
  return { error: 'cant move activity' }
}

const moveActivityFromEventToEvent = async (
  props,
  activity,
  parentId,
  targetId
) => {
  const activityId = activity.id
  try {
    props.deleteActivityFromEventOnlyLocally(activityId, activity.eventId)
    props.addActivityToEventOnlyLocally(targetId, activity)
    const res = await activityService.moveActivityFromEventToEvent(
      activityId,
      parentId,
      targetId
    )
    props.updateActivity(res)
    return res
  } catch (exception) {
    props.deleteActivityFromEventOnlyLocally(activityId, activity.eventId)
    props.addActivityToEventOnlyLocally(parentId, {
      ...activity,
      canDrag: true,
    })
  }
  props.pofTreeUpdate(props.activities)
  return { error: 'cant move activity' }
}

const DropActivity = {
  drop(props, monitor) {
    const item = monitor.getItem()
    const targetId = props.parentId
    const { parentId } = item
    const itemInBufferzone = item.bufferzone
    const targetIsBufferzone = props.bufferzone
    const activity = { ...item.activity }
    if (targetIsBufferzone && !itemInBufferzone) {
      moveActivityFromEventToBuffer(props, activity, parentId, targetId)
    } else if (!targetIsBufferzone && itemInBufferzone) {
      moveActivityFromBufferToEvent(props, activity, targetId)
    } else if (!targetIsBufferzone && !itemInBufferzone) {
      moveActivityFromEventToEvent(props, activity, parentId, targetId)
    }
  },
}

export default DropActivity
