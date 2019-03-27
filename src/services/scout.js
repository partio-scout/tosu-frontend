import axios from 'axios'
import { API_ROOT } from '../api-config'

const findOrCreateScout = async token => {
  const response = await axios.post(`${API_ROOT}/scouts/google/login`, {
    Authorization: token,
  })
  return response.data
}

const logout = async () => {
  const response = await axios.get(`${API_ROOT}/scouts/logout`)
  return response.data
}

export default { findOrCreateScout, logout }
