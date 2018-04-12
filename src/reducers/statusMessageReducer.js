import StatusMessage from "../components/StatusMessage";

const reducer = (state = {text: null, status: null}, action) => {
  if (action.type === 'SHOW_MESSAGE') {
    return Object.assign({...state}, {text: action.text})
  } else if (action.type === 'SHOW_STATUS') {
    return Object.assign({...state}, {status: action.status})
  }
  return state
}

export const addStatusMessage = text => dispatch => {
  dispatch({
    type: 'SHOW_MESSAGE',
    text
  })
}

export const addStatusInfo = status => dispatch => {
  dispatch({
    type: 'SHOW_STATUS',
    status
  })
}

export default reducer
