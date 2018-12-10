import React from 'react'
import Activity from '../components/Activity'

const mapActivities = (bufferZoneActivities, activities) => {
    bufferZoneActivities.map(activity => {
        const act = activities.filter(a => a.guid === activity.guid);
        return <Activity key={activity.id} act={act} activity={activity} />
    })
}

export default mapActivities