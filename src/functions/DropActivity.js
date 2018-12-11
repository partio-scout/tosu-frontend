import activityService from '../services/activities'

// These functions looked so ugly that I moved them to their own file :3

const moveActivityFromEventToBuffer = async (props, activity, parentId, targetId) => {
  const activityId = activity.id
  try {
    // Move activity locally
    props.postActivityToBufferOnlyLocally(activity)
    props.deleteActivityFromEventOnlyLocally(activityId)
    const res = await activityService.moveActivityFromEventToBufferZone(
      activityId,
      parentId
    )
    // Replace the moved activity (res )
    await props.deleteActivityFromBufferOnlyLocally(activityId)
    props.postActivityToBufferOnlyLocally(res)

    props.notify('Aktiviteetti siirretty!', 'success')
    return res
  } catch (exception) {
    props.deleteActivityFromBufferOnlyLocally(activityId)
    props.addActivityToEventOnlyLocally(parentId, { ...activity, canDrag: true })
    props.notify('Aktiviteettialue on täynnä!')
  }
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
    await props.deleteActivityFromEventOnlyLocally(activityId)
    props.addActivityToEventOnlyLocally(targetId, res)
    props.notify('Aktiviteetti siirretty!', 'success')
    return res
  } catch (exception) {
    props.deleteActivityFromEventOnlyLocally(activityId)
    props.postActivityToBufferOnlyLocally({ ...activity, canDrag: true })
    props.notify('Aktiviteetin siirrossa tuli virhe. Yritä uudestaan!')
  }
}

const moveActivityFromEventToEvent = async (props, activity, parentId, targetId) => {
  const activityId = activity.id
  try {
    await props.deleteActivityFromEventOnlyLocally(activityId)
    props.addActivityToEventOnlyLocally(targetId, activity)
    const res = await activityService.moveActivityFromEventToEvent(
      activityId,
      parentId,
      targetId
    )
    await props.deleteActivityFromEventOnlyLocally(activityId)
    props.addActivityToEventOnlyLocally(targetId, res)
    props.notify('Aktiviteetti siirretty!', 'success')
    return res
  } catch (exception) {
    await props.deleteActivityFromEventOnlyLocally(activityId)
    props.addActivityToEventOnlyLocally(parentId, { ...activity, canDrag: true })
    props.notify('Aktiviteetin siirrossa tuli virhe. Yritä uudestaan!')
  }
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
    props.pofTreeUpdate(props.buffer, props.events)
  }
}


export default DropActivity