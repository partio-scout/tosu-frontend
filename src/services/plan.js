import axios from 'axios'
import { API_ROOT } from '../api-config';
import { getGoogleToken } from '../services/googleToken'

const deletePlan = async (id) => {
  const response = await axios.delete(`${API_ROOT}/plans/${id}`, getGoogleToken)
  return response.data
}
 
const addPlanToActivity = async (data, activityId) => {
  const response = await axios.post(`${API_ROOT}/activity/${activityId}/plans`, data, getGoogleToken)
  return response.data
}

// const getPlansForActivity = async (activityId) => {
//    const response = await axios.get(`${API_ROOT}/activity/${activityId}/plans`)
// }

export default { deletePlan, addPlanToActivity }