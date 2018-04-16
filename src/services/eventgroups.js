import axios from 'axios'
import { API_ROOT } from '../api-config';
import { getGoogleToken } from '../services/googleToken'

const baseUrl = `${API_ROOT}/eventgroup`

const create = async () => {
  const response = await axios.post(baseUrl, getGoogleToken)
  return response.data
}

const deleteEventgroup = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getGoogleToken)
  return response.data
}


export default {create, deleteEventgroup}