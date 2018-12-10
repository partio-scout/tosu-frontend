import axios from 'axios'
import { API_ROOT } from '../api-config'

const deletePlan = async (id) => {
  const response = await axios.delete(`${API_ROOT}/plans/${id}`)
  return response.data
}

const addPlanToActivity = async (data, activityId) => {
  const response = await axios.post(`${API_ROOT}/activities/${activityId}/plans`, data)
  return response.data
}

// const getPlansForActivity = async (activityId) => {
//    const response = await axios.get(`${API_ROOT}/activity/${activityId}/plans`)
// }

export default { deletePlan, addPlanToActivity }
