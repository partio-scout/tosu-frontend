import axios from 'axios'
import { POF_ROOT } from '../api-config';
import { getGoogleToken } from '../services/googleToken'

const getAllTree = async () => {
  const response = await axios.get(`${POF_ROOT}/filledpof/tarppo`, getGoogleToken)
  return response.data
}

export default { getAllTree }