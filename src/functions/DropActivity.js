import activityService from '../services/activities'

// These functions looked so ugly that I moved them to their own file :3

const moveActivityFromEventToBuffer = async (props, activity, parentId) => {
  const activityId = activity.id
  try {
    // Move activity locally
    await props.postActivityToBufferOnlyLocally(activity)
    await props.deleteActivityFromEventOnlyLocally(activityId)
    const res = await activityService.moveActivityFromEventToBufferZone(
      activityId,
      parentId
    )
    // Replace the moved activity (res )
    await props.deleteActivityFromBufferOnlyLocally(activityId)
    await props.postActivityToBufferOnlyLocally(res)

    props.notify('Aktiviteetti siirretty!', 'success')
    return res
  } catch (exception) {
    await props.deleteActivityFromBufferOnlyLocally(activityId)
    await props.addActivityToEventOnlyLocally(parentId, {
      ...activity,
      canDrag: true,
    })
    props.notify('Aktiviteettialue on täynnä!')
  }
  props.pofTreeUpdate(props.buffer, props.events)
}

const moveActivityFromBufferToEvent = async (props, activity, targetId) => {
  const activityId = activity.id
  try {
    await props.addActivityToEventOnlyLocally(targetId, activity)
    await props.deleteActivityFromBufferOnlyLocally(activityId)
    const res = await activityService.moveActivityFromBufferZoneToEvent(
      activityId,
      targetId
    )
    await props.deleteActivityFromEventOnlyLocally(activityId)
    await props.addActivityToEventOnlyLocally(targetId, res)
    props.notify('Aktiviteetti siirretty!', 'success')
    return res
  } catch (exception) {
    await props.deleteActivityFromEventOnlyLocally(activityId)
    await props.postActivityToBufferOnlyLocally({ ...activity, canDrag: true })
    props.notify('Aktiviteetin siirrossa tuli virhe. Yritä uudestaan!')
  }
  props.pofTreeUpdate(props.buffer, props.events)
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
    await props.deleteActivityFromEventOnlyLocally(activityId)
    await props.addActivityToEventOnlyLocally(targetId, activity)
    const res = await activityService.moveActivityFromEventToEvent(
      activityId,
      parentId,
      targetId
    )
    await props.deleteActivityFromEventOnlyLocally(activityId)
    await props.addActivityToEventOnlyLocally(targetId, res)
    props.notify('Aktiviteetti siirretty!', 'success')
    return res
  } catch (exception) {
    await props.deleteActivityFromEventOnlyLocally(activityId)
    await props.addActivityToEventOnlyLocally(parentId, {
      ...activity,
      canDrag: true,
    })
    props.notify('Aktiviteetin siirrossa tuli virhe. Yritä uudestaan!')
  }
  props.pofTreeUpdate(props.buffer, props.events)
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
