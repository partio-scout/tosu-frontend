import axios from 'axios'
import { API_ROOT } from '../api-config'

// Never used...
// export const deleteScout = async (scoutId, token) => {
//   const response = await axios.delete(`${API_ROOT}/scouts/${scoutId}`)
//   return response.data
// }

export const findOrCreateScout = async token => {
  const response = await axios.post(`${API_ROOT}/scouts/google/login`, {
    Authorization: token,
  })
  return response.data
}

const logout = () => {
  window.location = `${API_ROOT}/scouts/logout`
}

export default { findOrCreateScout, logout }
