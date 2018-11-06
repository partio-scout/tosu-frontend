import axios from 'axios'
import { API_ROOT } from '../api-config';

const baseUrl = `${API_ROOT}/eventgroups`

const create = async () => {
  const response = await axios.post(baseUrl)
  return response.data
}

const deleteEventGroup = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}


export default {create, deleteEventGroup}