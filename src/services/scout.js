import axios from 'axios'
import { API_ROOT } from '../api-config';
import { getGoogleToken } from '../services/googleToken'

const deleteScout = async (scoutId,token) => {
  const response = await axios.delete(`${API_ROOT}/scouts/${scoutId}`, getGoogleToken)
  return response.data
}
 
const findOrCreateScout = async (token) => {
  /* const response = await axios.post(`${API_ROOT}/newscout`, getGoogleToken)
  return response.data */
}

const logout = async (token) => {
  // waiting for backend url
}

export default { deleteScout, findOrCreateScout, logout }