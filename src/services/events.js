import axios from "axios"
import { API_ROOT } from "../api-config"

const baseUrl = `${API_ROOT}/events`

const getAll = async userid => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async data => {
  const response = await axios.post(baseUrl, data)
  return response.data
}

const deleteEvent = async id => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

const addActivity = async (id, data) => {
  const response = await axios.post(`${baseUrl}/${id}/activities`, data)
  return response.data
}

const edit = async event => {
  const response = await axios.put(`${baseUrl}/${event.id}`, event)
  return response.data
}
const editInfo = async event => {
  const response = await axios.put(
    `${baseUrl}/${event.id}/info`,
    event.information
  )
  return response.data
}
export default { getAll, create, deleteEvent, addActivity, edit, editInfo }
