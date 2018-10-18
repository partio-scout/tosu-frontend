import axios from 'axios'
import { API_ROOT } from '../api-config';

const deleteScout = async (scoutId,token) => {
  const response = await axios.delete(`${API_ROOT}/scouts/${scoutId}`)
  return response.data
}

const findOrCreateScout = async (token) => {
  const response = await axios.post(`${API_ROOT}/scouts`, {Authorization: token})
  return response.data
}

const logout = async () => {
  const response = await axios.post(`${API_ROOT}/scouts/logout`, {})
  return response.data
}

export default { deleteScout, findOrCreateScout, logout }
