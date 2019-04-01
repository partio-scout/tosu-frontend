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

export function getRootGroup(pofData) {
  try {
    const pofTreeKey = Object.keys(pofData.entities.poftree)[0]
    const pofTree = pofData.entities.poftree[pofTreeKey]
    return pofTree.taskgroups.map(key => getTaskGroup(key, pofData))
  } catch (err) {
    return null
  }
}
