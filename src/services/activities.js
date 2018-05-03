import axios from 'axios'
import { API_ROOT } from '../api-config';

const getAllActivities = async () => {
  const response = await axios.get(`${API_ROOT}/activities/`)
  return response.data
}
const deleteActivity = async (id) => {
  const response = await axios.delete(`${API_ROOT}/activities/${id}`)
  return response.data
}

const addActivityToBufferZone = async (data) => {
  const response = await axios.post(`${API_ROOT}/activitybuffer/activities/`, data)
  return response.data
}

const getBufferZoneActivities = async () => {
  const response = await axios.get(`${API_ROOT}/activitybuffer`)
  return response.data
}

const moveActivityFromBufferZoneToEvent = async (id, targetId) => {
  const url = `${API_ROOT}/activity/${id}/frombuffer/toevent/${targetId}`
  //console.log(url)
  const response = await axios.put(url)
  return response.data
}

const moveActivityFromEventToBufferZone = async (activityId, parentId) => {
  const response = await axios.put(`${API_ROOT}/activity/${activityId}/fromevent/${parentId}/tobuffer`)
  return response.data
}

const moveActivityFromEventToEvent = async (activityId, parentId, targetId) => {
  const response = await axios.put(`${API_ROOT}/activity/${activityId}/fromevent/${parentId}/toevent/${targetId}`)
  return response.data
}

export default { getAllActivities, deleteActivity, addActivityToBufferZone, getBufferZoneActivities, moveActivityFromBufferZoneToEvent, moveActivityFromEventToBufferZone, moveActivityFromEventToEvent }
