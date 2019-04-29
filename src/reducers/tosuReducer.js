import tosuService from '../services/tosu'

/** @module */

/**
 * Reducer for tosus
 *
 */
const reducer = (state = {}, action) => {
  var newState = { ...state }
  switch (action.type) {
    case 'INIT_TOSU':
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
      // Deselect old Tosu
      newState[newState.selected].selected = false

      // Select new Tosu
      newState[action.tosuId].selected = true

      // Set selected to new Tosu id
      newState.selected = action.tosuId

      return newState

    case 'CREATE_TOSU':
      // Unselect old Tosu if such exists
      if (newState.selected) {
        newState[newState.selected] = {
          ...newState[newState.selected],
          selected: false,
        }
      }

      // Select newly created Tosu
      newState[action.newTosu.id] = {
        ...action.newTosu,
        selected: true,
      }

      newState.selected = action.newTosu.id
      return newState

    case 'UPDATE_TOSU':
      newState[action.tosu.id] = action.tosu
      return newState

    case 'DELETE_TOSU':
      // Delete the Tosu
      delete newState[action.tosuId]

      // Clear the state if the deleted Tosu was a last one
      if (Object.keys(newState).length <= 1) {
        return {}
      }

      // If deleted Tosu was selected, select new Tosu
      if (newState.selected === action.tosuId) {
        const newSelected = Object.keys(newState).find(
          key => key !== 'selected'
        )
        newState[newSelected].selected = true
        newState.selected = newSelected
      }

      return newState

    default:
      return state
  }
}

/**
 * Fetch list of Tosus belonging to the scout and save it in the store
 * @method
 * @return - id of the currently selected Tosu
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
 * @method
 * @param {Number} tosuId - ID of the Tosu to be selected
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
 * @method
 * @param {String} tosuName - Name for the new tosu
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

/**
 * Update a Tosu
 * @method
 * @param {Number} tosu - Tosu object with new values
 */
export const updateTosu = tosu => dispatch =>
  tosuService
    .updateTosu(tosu)
    .then(newTosu =>
      dispatch({
        type: 'UPDATE_TOSU',
        tosu: newTosu,
      })
    )
    .catch(error => console.log(error))

/**
 * Deletes specified Tosu.
 * @method
 * @param {Number} tosuId - ID of the Tosu to be deleted
 */
export const deleteTosu = tosuId => dispatch =>
  tosuService
    .deleteTosu(tosuId)
    .then(
      dispatch({
        type: 'DELETE_TOSU',
        tosuId,
      })
    )
    .catch(error => console.log(error))

export default reducer
