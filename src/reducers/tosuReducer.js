import tosuService from '../services/tosu'

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'INIT_TOSU':
      const selectedTosu = action.tosuList.find(tosu => tosu.selected)
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
      var oldSelected = state[state.selected]
      oldSelected.selected = false
      return {
        ...state,
        [action.newTosu.id]: action.newTosu,
        selected: action.newTosu.id,
        [oldSelected.id]: oldSelected,
      }
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
  dispatch({
    type: 'INIT_TOSU',
    tosuList,
  })
  return tosuList.find(tosu => tosu.selected).id
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
export const createTosu = tosuName => dispatch =>
  tosuService
    .create(tosuName)
    .then(newTosu =>
      dispatch({
        type: 'CREATE_TOSU',
        newTosu,
      })
    )
    .catch(error => console.log(error))

export default reducer
