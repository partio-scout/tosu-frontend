import activityService from '../services/activities'

// These functions looked so ugly that I moved them to their own file :3
/** @module DropActivity */

/**
 * Move activity from event to buffer
 * @method
 * @param {Object} props - props from parent component
 * @param {Object} activity - target activity
 * @param {(Number|String)} parentId 
 *
 */
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
}

/**
 * Move activity from buffer to event
 * @method
 * @param {Object} props - props from parent component
 * @param {Object} activity - target activity
 * @param {(Number|String)} targetId 
 *
 */
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
  return { error: 'cant move activity' }
}

/**
 * Move activity from event to event
 * @method
 * @param {Object} props - props from parent component
 * @param {Object} activity - target activity
 * @param {(Number|String)} parentId - id of the parent event
 * @param {(Number|String)} targetId - id of the target event
 *
 */
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
  return { error: 'cant move activity' }
}
/**
 * Define DnD behaviour
 * @method
 *
 */
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
