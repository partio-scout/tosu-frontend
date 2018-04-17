import axios from 'axios'
import { API_ROOT } from '../api-config';
import { getGoogleToken } from '../services/googleToken'

const getAllActivities = async () => {
  const response = await axios.get(`${API_ROOT}/activities/`, getGoogleToken)
  return response.data
}
const deleteActivity = async (id) => {
  const response = await axios.delete(`${API_ROOT}/activities/${id}`, getGoogleToken)
  return response.data
}

const addActivityToBufferZone = async (data) => {
  const response = await axios.post(`${API_ROOT}/activitybuffer/1/activities/`, data, getGoogleToken)
  return response.data
}

const getBufferZoneActivities = async () => {
  const response = await axios.get(`${API_ROOT}/activitybuffer/0`, getGoogleToken)
  return response.data
}

const moveActivityFromBufferZoneToEvent = async (id, parentId, targetId) => {
  const url = `${API_ROOT}/activity/${id}/frombuffer/${parentId}/toevent/${targetId}`
  //console.log(url)
  const response = await axios.put(url, getGoogleToken)
  return response.data
}

const moveActivityFromEventToBufferZone = async (activityId, parentId, targetId) => {
  const response = await axios.put(`${API_ROOT}/activity/${activityId}/fromevent/${parentId}/tobuffer/${targetId}`, getGoogleToken)
  return response.data
}

const moveActivityFromEventToEvent = async (activityId, parentId, targetId) => {
  const response = await axios.put(`${API_ROOT}/activity/${activityId}/fromevent/${parentId}/toevent/${targetId}`, getGoogleToken)
  return response.data
}

export default { getAllActivities, deleteActivity, addActivityToBufferZone, getBufferZoneActivities, moveActivityFromBufferZoneToEvent, moveActivityFromEventToBufferZone, moveActivityFromEventToEvent }
