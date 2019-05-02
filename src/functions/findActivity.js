/** @module */


/**
 * Find activity from the poftree map
 * @method
 * @param activity activity that is searched
 * @param pofTree tree where the search is conducted
 */
const findActivity = (activity, pofTree) => {
  if (activity === undefined || pofTree === undefined) {
    return null
  }
  return pofTree.entities.activities[activity.guid]
}

export default findActivity
