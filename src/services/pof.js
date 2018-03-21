import axios from 'axios'
import { API_ROOT } from '../api-config';

const getAll = async () => {
  const response = await axios.get(`${API_ROOT}/pofdata/tarppo`)
  return response.data
}

export default { getAll }