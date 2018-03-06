import axios from 'axios'
import { API_ROOT } from '../api-config';

const getAll = async () => {
  const response = await axios.get(`${API_ROOT}/events`)
  console.log("response data", response.data)
  return response.data
}


export default {getAll}