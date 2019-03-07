import React from 'react'
import isTouchDevice from 'is-touch-device'

// helpers
// put all picked activities from events and buffer into a string array made of their guid
// we use that to search/filter from pofdata
const arrayActivityGuidsFromBufferAndEvents = (buffer, events) => {
  let activities = []
  buffer.activities.forEach(activity => {
    activities = activities.concat(activity.guid)
  })
  events.forEach(event => {
    event.activities.forEach(activity => {
      activities = activities.concat(activity.guid)
    })
  })
  return activities
}

// pof contains a specific order which is why we sort
const orderSorter = (a, b) => b.isMandatory - a.isMandatory

const sortTreeByOrder = root => {
  // root.taskgroups = root.taskgroups.sort((a, b) => a.order - b.order)
  return root
}

// recursively go into taskgroups of taskgroups and disable all optional tasks
const setChildrenTasksDisabled = root => {
    const activityKeys = Object.keys(root.entities.activities)
    activityKeys.forEach(key => {
        const activity = root.entities.activities[key]
        if (activity.tags.pakollisuus[0].slug !== 'mandatory') {
            activity.disabled = true
        }
    })
    return root
}

// TreeSearchBar needs specific variables added to our pofdata
// which is done here recursively
const fillWithNeededVariable = root => {
  console.log(root)
  const pofTreeKey = Object.keys(root.entities.poftree)[0]
  const taskGroupKeys = Object.keys(root.entities.tarppo)
  taskGroupKeys.forEach(key => {
    const obj = root.entities.tarppo[key]
    obj.key = obj.guid
    obj.label = obj.title
    obj.title = <span name={obj.title}>{obj.title}</span>
    obj.value = obj.guid
    obj.children = [].concat(obj.taskgroups)
  })
  const activityKeys = Object.keys(root.entities.activities)
  activityKeys.forEach(key => {
    const task = root.entities.activities[key]
    task.key = task.guid
    task.value = task.guid
    // add isMandatory -> avoid hardcoded mandatory string check
    task.isMandatory = task.tags.pakollisuus[0].slug === 'mandatory'
    task.label = task.title
    task.title = (
      <span
        name={task.title}
        className="tree-search-title"
        style={{ backgroundColor: task.isMandatory ? '#2196f3' : '#E3F2FD' }}
      >
        {task.title}
      </span>
    )
  })
  return root
}

// recursively disable existing tasks and enable if removed
const disableTasksInFilterIfExists = (root, existingActivityGuids) => {
  const activityKeys = Object.keys(root.entities.activities)
  activityKeys.forEach(key => {
      const task = root.entities.activities[key]
      task.disabled = existingActivityGuids.includes(task.value)
    })
  return root
}

const lockOptionalTasksIfMandatoryLeftToPickInAGroup = (
  root,
  existingActivityGuids
) => {
  if (!root) return
  const taskgroupKeys = Object.keys(root.entities.tarppo)
  taskgroupKeys.forEach(key => {
    const majorTaskGroup = root.entities.tarppo[key]
    const mandatoryTaskGuids = majorTaskGroup.mandatory_tasks.split(',') // mandatory tasks are listed in major group
    if (mandatoryTaskGuids[0] === '') {
      // empty split return and array with only value as ''
      return
    }
    // if existing activities do not contain all mandatory tasks -> disable all optional
    mandatoryTaskGuids.forEach(mandatoryTaskGuid => {
      if (existingActivityGuids.includes(mandatoryTaskGuid) === false) {
        setChildrenTasksDisabled(root)
      }
    })
  })
  return root
}

const updateState = (state, existingActivityGuids) => {
  let updatedState = Object.assign({}, state)
  console.log(updatedState)
  updatedState = disableTasksInFilterIfExists(
    updatedState,
    existingActivityGuids
  )
  updatedState = lockOptionalTasksIfMandatoryLeftToPickInAGroup(
    updatedState,
    existingActivityGuids
  )
  return updatedState
}

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'INIT_TREE_POF':
      // add variables and sort that TreeSearchBar uses
      console.log(action)
      const sortedTree = sortTreeByOrder(action.pofJson)
      console.log(sortedTree)
      const filledTree = fillWithNeededVariable(sortedTree)
      return filledTree
    case 'SET_TREE_POF':
      // update data by disabling existing activities &
      // locking non-mandatory tasks if a tarppo has mandatory tasks left to pick
      return updateState(state, action.existingActivityGuids)
    default:
      return state
  }
}

export const pofTreeInitialization = pofJson => ({
  type: 'INIT_TREE_POF',
  pofJson,
})

export const pofTreeUpdate = (buffer, events) => ({
  type: 'SET_TREE_POF',
  existingActivityGuids: arrayActivityGuidsFromBufferAndEvents(
    isTouchDevice() ? { id: 0, activities: [] } : buffer,
    events
  ),
})

export default reducer
