import {normalize} from 'normalizr'

import eventService from '../services/events'
import {eventSchema } from '../pofTreeSchema'

/**
 * Change tosu in redux state
 *
 * params are the dispatches as named and
 * @param tosuId - id of the new tosu
 * @param activities - the current activities state
 * @param buffer - the current buffer state
 *
 *
 */
const tosuChange = async (
  tosuId,
  setLoading,
  selectTosu,
  eventsInitalization,
  activityInitialization,
  pofTreeUpdate,
  activities,
  buffer
) => {
    setLoading(true)
    await selectTosu(tosuId)
    // zero the event state so 
    eventsInitalization({})
    const eventDataRaw = await eventService.getAll(tosuId)
    const eventData = normalize(eventDataRaw, eventSchema).entities
    if(!eventData.activities) eventData.activities = {}
    if(!eventData.events) eventData.events = {}
    const bufferActivities = buffer.activities.map(key => (activities[key]))
    activityInitialization(Object.keys(eventData.activities).map(key => eventData.activities[key]),
        bufferActivities
    )
    eventsInitalization(eventData.events)
    pofTreeUpdate(activities)
    setLoading(false)

}

export default tosuChange
