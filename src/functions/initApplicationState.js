import axios from 'axios'
import { normalize } from 'normalizr'
import activityService from '../services/activities'

import { pofTreeInitialization } from '../reducers/pofTreeReducer'
import { eventInitialization } from '../reducers/eventReducer'
import { bufferZoneInitialization } from '../reducers/bufferZoneReducer'
import { activityInitialization } from '../reducers/activityReducer'
import { POF_ROOT } from '../api-config'
import { pofTreeSchema, eventSchema } from '../pofTreeSchema'
import eventService from '../services/events'

const initialization = async props => {
  const pofRequest = await axios.get(`${POF_ROOT}/filledpof/tarppo`)
  const pofData = pofRequest.data
  const normalizedPof = normalize(pofData, pofTreeSchema)
  props.pofTreeInitialization(normalizedPof)
  const eventDataRaw = await eventService.getAll(props.scout.id)
  const eventData = normalize(eventDataRaw, eventSchema).entities
  console.log(eventData)
  const buffer = await activityService.getBufferZoneActivities(props.scout.id)
  console.log(buffer)
  props.activityInitialization(
    Object.keys(eventData.activities).map(key => eventData.activities[key]),
    buffer.activities
  )
  props.eventsInitialization(eventData.events)
  props.bufferZoneInitialization(buffer)
}

export default initialization
