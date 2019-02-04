import axios from 'axios'
import { POF_ROOT } from '../api-config'

const getAllTree = async () => {
  const response = await axios.get(`${POF_ROOT}/filledpof/tarppo`)
  return response.data
}

export default { getAllTree }
