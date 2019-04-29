/** Module contains functions to pull out certain objects from pofTree object
 */

/**
 * Get task from pofData
 * @param guid - guid of the task
 * @return task/activity
 */
export function getTask(guid, pofData) {
  try {
    const task = Object.assign({}, pofData.entities.activities[guid])
    task.suggestions_details = task.suggestions_details.map(
      key => pofData.entities.suggestions[key]
    )
    return task
  } catch (err) {
    return null
  }
}


/**
 * Get Taskgroup (tarppo) from pofdata
 * @param guid - guid of the taskgroup (tarppo)
 * @param pofdata - normalized pofdata object
 * @return taskgroup object
 *
 */
export function getTaskGroup(guid, pofData) {
  try {
    const taskGroup = Object.assign({}, pofData.entities.tarppo[guid])
    if (taskGroup.tasks.length > 0) {
        taskGroup.tasks = taskGroup.tasks.map(key => getTask(key, pofData))
        taskGroup.children = taskGroup.tasks
    } else if (taskGroup.taskgroups.length > 0 ) {
        taskGroup.taskgroups = taskGroup.taskgroups.map(key => (getTaskGroup(key, pofData)))
        taskGroup.children = taskGroup.taskgroups
    }
    return taskGroup
  } catch (err) {
    console.log(err)
    return null
  }
}
/**
 * Get the root taks group. These groups (tarppo) will
 * show up in the tree search bar.
 *
 * @param pofdata - normalized pofdata
 * @return rootGroup - rootgroup object
 * @return null - if something unexpected happens
 *
 */
export function getRootGroup(pofData) {
  try {
    const pofTreeKey = Object.keys(pofData.entities.poftree)[0]
    const pofTree = pofData.entities.poftree[pofTreeKey]
    return pofTree.taskgroups.map(key => getTaskGroup(key, pofData))
  } catch (err) {
    return null
  }
}
