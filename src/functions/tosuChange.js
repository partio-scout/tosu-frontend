import { normalize } from 'normalizr'
import eventService from '../services/events'
import { eventSchema } from '../pofTreeSchema'

/** @module tosuChange */


/**
 * empty buffer
 * @method
 * @param {Object} buffer
 * @param {Number} buffer.id - id of the buffer
 * @param {Object[]} buffer.activities - activities in buffer
 * @param {Func} deleteActivity 
 * @param {Func} deleteActivityFromBuffer
 *
 */
const emptyBuffer = async(buffer, deleteActivityFromBuffer, deleteActivity) => {
    let promises = buffer.activities.map((a) =>(deleteActivityFromBuffer(a)))
    promises = promises.concat(buffer.activities.map(a => deleteActivity(a)))
    await Promise.all(promises)
}



/**
 * Change tosu in redux state
 *
 * params are the dispatches as named and
 *
 * @method
 * @param tosuId - id of the new tosu
 * @param activities - the current activities state
 * @param buffer - the current buffer state
 *
 * @description Change tosu in redux state. This function has some side effects.
 * Do not call again before the 
 * first run has finished.
 * SOLUTION to unstablilty
 * is to combine eventReducer, bufferReducer and activityReducer
 * to a single reducer.
 */
const tosuChange = async (
  tosuId,
  setLoading,
  selectTosu,
  eventsInitalization,
  activityInitialization,
  pofTreeUpdate,
  activities,
  buffer,
  deleteActivity,
  deleteActivityFromBuffer,
) => {
  setLoading(true)
  await emptyBuffer(buffer, deleteActivityFromBuffer, deleteActivity)
  await selectTosu(tosuId)
  eventsInitalization({})
  const eventDataRaw = await eventService.getAll(tosuId)
  const eventData = normalize(eventDataRaw, eventSchema).entities
  if (!eventData.activities) eventData.activities = {}
  if (!eventData.events) eventData.events = {}
  const bufferActivities = buffer.activities.map(key => activities[key])
  activityInitialization(
    Object.keys(eventData.activities).map(key => eventData.activities[key]),
    bufferActivities
  )
  eventsInitalization(eventData.events)
  pofTreeUpdate(activities)
  setLoading(false)
}

export default tosuChange
