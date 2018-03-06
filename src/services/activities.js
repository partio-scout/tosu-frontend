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
export default {getAll, deleteActivity}