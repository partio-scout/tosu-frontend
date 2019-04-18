let found = null

/**
 * Recursively finds a given activity from the pofTree or returns null if activity is not defined
 * @param activity activity that is searched
 * @param pofTree tree where the search is conducted
 */
const findActivity = (activity, pofTree) => {
  found = null
  if (activity === undefined || pofTree === undefined) {
    console.log('null input')
    return null
  }
  return pofTree.entities.activities[activity.guid]
}

export default findActivity
