/** @module uiReducer */

/**
 * Reducer for view changes
 * @method 
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SIDEBAR':
      return { ...state, sideBarVisible: action.value }
    case 'SET_VIEW':
      return { ...state, view: action.filter }
    default:
      return state
  }
}

const initialState = {
  sideBarVisible: false,
  view: 'OWN',
}

/**
 * SetSidebar visibility
 * @method
 * @param {Boolean} value 
 *
 */
export const setSideBar = value => ({
  type: 'SET_SIDEBAR',
  value,
})
/**
 * Set view
 * @method
 * @param filter - filter for the view 
 *
 */
export const viewChange = filter => ({
  type: 'SET_VIEW',
  filter,
})

export default reducer
