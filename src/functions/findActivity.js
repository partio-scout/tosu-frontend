let found = null

/**
 * Recursively finds a given activity from the pofTree
 * @param activity activity that is searched
 * @param root current node
 */
const findInTreePof = (activity, root) => {
  if (root === undefined || found !== null) {
    return
  }
  if (root.taskgroups !== undefined) {
    root.taskgroups.forEach(group => {
      findInTreePof(activity, group)
    })
  }
  if (root.tasks !== undefined) {
    root.tasks.forEach(task => {
      findInTreePof(activity, task)
    })
  }
  if (activity.guid === root.guid) {
    found = root
  }
}
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
