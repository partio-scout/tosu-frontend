import tosuService from '../services/tosu'

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_TOSU':
      return Object.assign(state, { selected: action.tosuId })
    default:
      return state
  }
}

/* 
 * Will be in the form of:
  {
    selected: tosuId,
    allTosus: {
      tosuId: { 
        scoutId,
        name,
        selected,
       }
    }
  }
*/
const initialState = tosuService.getAll()

/**
 * Creates an action to select new Tosu
 * @param {String} tosuId - Name of the Tosu
 * @returns action
 */
export const selectTosu = tosuId => ({
  type: 'SELECT_TOSU',
  tosuId,
})

export default reducer
