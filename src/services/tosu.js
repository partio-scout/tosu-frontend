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
  const newTosu = await axios.post(`${baseUrl}/${tosuName}`)
  const selected = await axios.put(`${baseUrl}/select/${newTosu.data.id}`)
  return selected.data
}

const deleteTosu = async tosuId => {
    const response = await axios.delete(`${baseUrl}/${tosuId}`)
    return response.data
}

export default { getAll, select, create, deleteTosu }
