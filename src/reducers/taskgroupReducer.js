/** @module */

const reducer = (state = null, action) => {
  if (action.type === 'SELECT') {
    return action.taskgroup
  } else if (action.type === 'EMPTY') {
    return null
  }
  return state
}
/**
 * Select taskgroup
 * @method
 * @param {Object} taskgroup - selected taskgroup "tarppo"
 *
 */
export const selectTaskgroup = taskgroup => ({
  type: 'SELECT',
  taskgroup,
})
/**
 * Empty the taskgroup selection
 * @method
 *
 */
export const emptyTaskgroup = () => ({
  type: 'EMPTY',
})

export default reducer
