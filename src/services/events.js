import axios from 'axios'
import { API_ROOT } from '../api-config';
import { getGoogleToken } from '../services/googleToken'

const baseUrl = `${API_ROOT}/events`

const getAll = async (userid) => {
  const response = await axios.get(baseUrl, getGoogleToken)
  return response.data
}

const create = async (data) => {
  const response = await axios.post(baseUrl, data, getGoogleToken)
  return response.data
}

const deleteEvent = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getGoogleToken)
  return response.data
}

const addActivity = async (id, data) => {
  const response = await axios.post(`${baseUrl}/${id}/activities`, data, getGoogleToken)
  return response.data

}

const edit = async(event) => {
  //console.log(event)
  const response = await axios.put(`${baseUrl}/${event.id}`, event, getGoogleToken)
  return response.data
}

export default {getAll, create, deleteEvent, addActivity, edit}