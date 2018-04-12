import axios from 'axios'
import { API_ROOT } from '../api-config';

const deleteScout = async (scoutId,token) => {
  const response = await axios.delete(`${API_ROOT}/scouts/${scoutId}`, token)
  return response.data
}
 
const findOrCreateScout = async (token) => {
  const response = await axios.post(`${API_ROOT}/newscout`, token)
  return response.data
}
//token is googleIdToken

export default { deleteScout, findOrCreateScout }