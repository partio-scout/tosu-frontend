
import activityService from '../services/activities'


export const addActivityToRelevantReducers = async (props, activity) => {
    const backendActivity = await activityService.addActivityToBufferZone(activity)
    props.addActivity(backendActivity)
    props.postActivityToBuffer(backendActivity)
}


