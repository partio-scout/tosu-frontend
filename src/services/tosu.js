import axios from 'axios'
import { API_ROOT } from '../api-config'

const baseUrl = `${API_ROOT}/tosu`

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const edit = async tosu => {
  const response = await axios.put(`${baseUrl}/${tosu.id}`, tosu)
  return response.data
}

export default { getAll }
