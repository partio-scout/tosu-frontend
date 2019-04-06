import tosuService from '../services/tosu'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'INIT_TOSU':
      console.log(action.tosuList)
      var selectedTosu = action.tosuList.find(tosu => tosu.selected)
      if (!selectedTosu && action.tosuList.length > 0) {
        selectedTosu = action.tosuList[0]
        selectedTosu.selected = true
      } else if (action.tosuList.length === 0) {
        return {}
      }
      const tosuMap = action.tosuList.reduce(
        (soFar, row) => ({ ...soFar, ...{ [row.id]: row } }),
        {}
      )
      return {
        selected: selectedTosu.id,
        ...tosuMap,
      }
    case 'SELECT_TOSU':
      // Get previously selected and set its state to false
      var oldSelected = state[state.selected]
      oldSelected.selected = false

      // Get newly selected and set its state to true
      var newSelected = state[action.tosuId]
      newSelected.selected = true

      // Return new state with updated objects for oldSelected and newSelected,
      // and selected set to new ID.
      return {
        ...state,
        [oldSelected.id]: oldSelected,
        [newSelected.id]: newSelected,
        selected: action.tosuId,
      }
    case 'CREATE_TOSU':
      if (state.selected) {
        return {
          ...state,
          [action.newTosu.id]: { ...action.newTosu, selected: false },
        }
      } else {
        return {
          ...state,
          [action.newTosu.id]: { ...action.newTosu, selected: true },
          selected: action.newTosu.id,
        }
      }
    case 'DELETE_TOSU':
      const newState = { ...state }
      delete newState[action.tosuId]
      const selected = {
        ...Object.keys(newState)
          .map(key => newState[key])
          .find(tosu => !tosu.selected),
      }
      console.log(selected)
      if (!selected.id) {
        return {}
      }
      selected.selected = true
      newState.selected = selected.id
      return newState
    default:
      return state
  }
}
/**
 * Fetch list of Tosus belonging to the scout and save it in the store
 * @returns id of the currently selected Tosu
 */
export const tosuInitialization = () => async dispatch => {
  const tosuList = await tosuService.getAll()
  if (tosuList.length <= 0) {
    return null
  }
  dispatch({
    type: 'INIT_TOSU',
    tosuList,
  })
  var tosu = tosuList.find(tosu => tosu.selected)
  if (!tosu && tosuList.length > 0) {
    tosu = tosuList[0]
  }
  return tosu.id
}

/**
 * Select new Tosu and update selection in backend
 * @param tosuId - ID of the Tosu to be selected
 */
export const selectTosu = tosuId => dispatch =>
  tosuService
    .select(tosuId)
    .then(updatedTosu =>
      dispatch({
        type: 'SELECT_TOSU',
        tosuId: updatedTosu.id,
      })
    )
    .catch(error => console.log(error))

/**
 * Create new tosu and push to backend
 * @param tosuName - Name for the new tosu
 */
export const createTosu = tosuName => async dispatch => {
  try {
    const newTosu = await tosuService.create(tosuName)
    dispatch({
      type: 'CREATE_TOSU',
      newTosu,
    })
    return newTosu
  } catch (error) {
    console.error(error)
  }
}

export const deleteTosu = tosuId => dispatch => {
  tosuService
    .deleteTosu(tosuId)
    .then(() => dispatch({ type: 'DELETE_TOSU', tosuId }))
}

export default reducer
