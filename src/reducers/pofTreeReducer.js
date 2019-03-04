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
  if (!root) return {}
  if (!root.taskgroups) return {}
  if (!root.taskgroups.forEach) return {}

  root.taskgroups.forEach(sortTreeByOrder)
  root.taskgroups = root.taskgroups.sort((a, b) => a.order - b.order)
  return root
}

// recursively go into taskgroups of taskgroups and disable all optional tasks
const setChildrenTasksDisabled = pofChild => {
  const root = pofChild
  if (!root) return

  if (root.children && root.children.forEach) {
    // groups have children, tasks do not ->recursion into groups
    root.children.forEach(setChildrenTasksDisabled)
  }
  if (!root.tasks) {
    // it's a task
    if (root.tags.pakollisuus[0].slug !== 'mandatory') {
      root.disabled = true
    }
  }
}

// TreeSearchBar needs specific variables added to our pofdata
// which is done here recursively
const fillWithNeededVariable = root => {
  if (!root) return {}
  if (!root.taskgroups) return {}
  if (!root.taskgroups.forEach) return {}

  root.taskgroups.forEach(fillWithNeededVariable)

  root.key = root.guid
  root.label = root.title
  root.title = <span name={root.title}>{root.title}</span>
  root.value = root.guid
  root.children = [].concat(root.taskgroups)

  if (root && root.tasks && root.tasks.sort) {
    root.tasks.forEach(task => {
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
    root.children = root.children.concat(root.tasks.sort(orderSorter))
  }
  return root
}

// recursively disable existing tasks and enable if removed
const disableTasksInFilterIfExists = (root, existingActivityGuids) => {
  if (!root) return {}
  if (!root.taskgroups) return {}
  if (!root.taskgroups.forEach) return {}

  try {
    root.taskgroups.forEach(group =>
      disableTasksInFilterIfExists(group, existingActivityGuids)
    )
  } catch (exception) {
    console.log('problem occurred iterating throguh taskgroups', exception)
  }

  if (root && root.children && root.children.forEach) {
    root.children.forEach(task => {
      task.disabled = existingActivityGuids.includes(task.value)
    })
  }
  return root
}

const lockOptionalTasksIfMandatoryLeftToPickInAGroup = (
  pof,
  existingActivityGuids
) => {
  if (!pof) return {}
  if (!pof.taskgroups) return {}
  if (!pof.taskgroups.forEach) return {}
  pof.taskgroups.forEach(majorTaskGroup => {
    const mandatoryTaskGuids = majorTaskGroup.mandatory_tasks.split(',') // mandatory tasks are listed in major group
    if (mandatoryTaskGuids[0] === '') {
      // empty split return and array with only value as ''
      return
    }
    // if existing activities do not contain all mandatory tasks -> disable all optional
    mandatoryTaskGuids.forEach(mandatoryTaskGuid => {
      if (existingActivityGuids.includes(mandatoryTaskGuid) === false) {
        setChildrenTasksDisabled(majorTaskGroup)
      }
    })
  })
  return pof
}

const updateState = (state, existingActivityGuids) => {
  let updatedState = Object.assign({}, state)
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
      const sortedTree = sortTreeByOrder(action.pofJson.data)
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
