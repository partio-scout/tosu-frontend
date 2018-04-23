import axios from 'axios'
import { API_ROOT } from '../api-config';

const deleteScout = async (scoutId,token) => {
  const response = await axios.delete(`${API_ROOT}/scouts/${scoutId}`)
  return response.data
}
 
const findOrCreateScout = async (token) => {
  const response = await axios.post(`${API_ROOT}/scout`)
  return response.data
}

const logout = async (token) => {
  // waiting for backend url
}

export default { deleteScout, findOrCreateScout, logout }