import axios from 'axios'
import { API_ROOT } from '../api-config';

const getAll = async () => {
  const response = await axios.get(`${API_ROOT}/pofdata`)
  return response.data
}

const deleteActivity = async (id) => {
  const response = await axios.delete(`${API_ROOT}/activities/${id}`)
  return response.data
}

const addActivityToBufferZone = async (data) => {
  const response = await axios.post(`${API_ROOT}/activitybuffer/1/activities/`, data)
  return response.data
}

const getBufferZoneActivities = async () => {
  const response = await axios.get(`${API_ROOT}/activitybuffer/0`)
  return response.data
}

const moveActivityFromBufferZoneToActivity = async (id, parentId, targetId) => {
  const response = await axios.put(`${API_ROOT}/activity/${id}/frombuffer/${parentId}/toevent/${targetId}`)
  return response.data
}

export default { getAll, deleteActivity, addActivityToBufferZone, getBufferZoneActivities, moveActivityFromBufferZoneToActivity }