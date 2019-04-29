
import activityService from '../services/activities'

/**
 * Add activity to backend buffer, activityReducer and bufferReducer
 * @param props - props that have the needed dispathces
 * @param props.addActivity - dispatch for addActivity
 * @param props.postActivityToBuffer - dispatch for adding activity to buffer
 * @param activity - PofTree activity
 */
export const addActivityToRelevantReducers = async (props, activity) => {
    const backendActivity = await activityService.addActivityToBufferZone(activity)
    props.addActivity(backendActivity)
    props.postActivityToBuffer(backendActivity)
}


