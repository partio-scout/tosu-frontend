import axios from 'axios'
import { API_ROOT } from '../api-config';

const baseUrl = `${API_ROOT}/eventgroup`

const create = async () => {
  const response = await axios.post(baseUrl)
  return response.data
}


export default {create}