import axios from 'axios'
import { API_ROOT } from '../api-config'

const findOrCreateScout = async token => {
  const response = await axios.post(`${API_ROOT}/scouts/google/login`, {
    Authorization: token,
  })
  return response.data
}

const logout = () => {
  window.location = `${API_ROOT}/scouts/logout`
}

export default { findOrCreateScout, logout }
