/* @module */

/**
 * Reducer for plan state
 * @method
 */
const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_PLANS':
      return state.concat(action.plans)
    case 'SAVE_PLAN':
      return state.map(item => {
        if (item.id !== action.id) {
          return item
        }
        return {
          ...item,
          plans: item.plans.concat({
            id: action.suggestionId,
            ...action.suggestion,
          }),
        }
      })

    case 'DELETE_PLAN':
      return state.map(item => {
        if (item.id !== action.activityId) {
          return item
        }
        return {
          ...item,
          plans: item.plans.filter(plan => plan.id !== action.id),
        }
      })
    default:
      return state
  }
}
/**
 * Set initial plans
 * @method
 * @param {Object[]} plans - list of plans
 *
 */
export const initPlans = plans => ({
  type: 'INIT_PLANS',
  plans,
})


/**
 * Save a plan
 * @method
 * @param {Object} suggestion
 * @param {Number] id
 * @param {SuggestionId}
 *
 */
export const savePlan = (suggestion, id, suggestionId) => ({
  type: 'SAVE_PLAN',
  id,
  suggestion,
  suggestionId,
})
/**
 * Delete a plan from sate
 * @method
 * @param {Number} id
 * @param {Number} activityId - id for activity 
 */
export const deletePlan = (id, activityId) => ({
  type: 'DELETE_PLAN',
  id,
  activityId,
})

export default reducer
