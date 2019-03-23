import axios from 'axios'
import { API_ROOT } from '../api-config'

const baseUrl = `${API_ROOT}/tosus`

/**
 * Fetch list of Tosus from backend
 */
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

/**
 * Update selected Tosu on the backend
 * @param tosuId ID of the Tosu
 * @returns Updated Tosu object
 */
const select = async tosuId => {
  const response = await axios.put(`${baseUrl}/select/${tosuId}`)
  return response.data
}

const create = async tosuName => {
  const response = await axios.post(`${baseUrl}/${tosuName}`)
  return response.data
}

export default { getAll, select, create }
