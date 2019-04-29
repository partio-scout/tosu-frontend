/** @module */

/**
 * Reducer for appliaction loading state
 * @method
 * @param {Bool} state - is application loading
 * @param {Object} action - Reducer appliaction
 * @param {Bool} action.bool - boolean for new state
 *
 */
const reducer = (state = true, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return action.bool
    default:
      return state
  }
}

/**
 * Set application loading state
 * @method
 * @param {Bool} bool - the new state 
 *
 */
export const setLoading = bool => ({
  type: 'SET_LOADING',
  bool,
})

export default reducer
