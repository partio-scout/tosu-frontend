let found = null

/** Recursively finds a given activity from the pofTree */
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
/** Recursively finds a given activity from the pofTree or returns null if activity is not defined */
const findActivity = (activity, pofTree) => {
  found = null
  if (activity === undefined || pofTree === undefined) {
    console.log('null input')
    return null
  }
  findInTreePof(activity, pofTree)
  return found
}

export default findActivity
