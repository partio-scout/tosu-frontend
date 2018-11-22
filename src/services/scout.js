import axios from 'axios'
import { API_ROOT } from '../api-config';

const deleteScout = async (scoutId,token) => {
  const response = await axios.delete(`${API_ROOT}/scouts/${scoutId}`)
  return response.data
}

const findOrCreateScout = async (token) => {
  const response = await axios.post(`${API_ROOT}/scouts/google/login`, {Authorization: token})
  return response.data
}

const logout = async () => {
  const response = await axios.post(`${API_ROOT}/scouts/google/logout`, {})
  return response.data
}

const partioLogin = async () => {
  const response = await axios.get(`${API_ROOT}/scouts/login`, {})
  console.log(response)
}

export default { deleteScout, findOrCreateScout, logout, partioLogin }
