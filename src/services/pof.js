import axios from 'axios'
import { POF_ROOT } from '../api-config';

const getAll = async () => {
  const response = await axios.get(`${POF_ROOT}/pofdata/tarppo`)
  return response.data
}

export default { getAll }