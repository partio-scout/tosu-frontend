import React from 'react'
import isTouchDevice from 'is-touch-device'
import { eventList } from './eventReducer'
import { getActivityList } from './activityReducer'
// helpers
/*
 * put all picked activities from events and buffer into a string array made of their guid
 * we use that to search/filter from pofdata
 */
const arrayActivityGuidsFromBufferAndEvents = activities => {
  return getActivityList(activities).map(activity => activity.guid)
}

/**
 * disable all optional tasks in tarppo(taskgroup) and its subordinate tarppos(taskgroup)
 * @param {string} GUID - GUID for taskgroup
 * @param {object} root - DEEP copy of pofdata
 */
const setChildrenTasksDisabled = (GUID, root) => {
  const taskgroup = root.entities.tarppo[GUID]
  const activityKeys = taskgroup.tasks
  activityKeys.forEach(key => {
    const activity = root.entities.activities[key]
    if (activity.tags.pakollisuus[0].slug !== 'mandatory') {
      activity.disabled = true
    }
  })
  taskgroup.taskgroups.forEach(key => setChildrenTasksDisabled(key, root))
  return root
}

/**
 * Add variables used by TreeSearch component to the pofData
 * @param {object} root - DEEP copy of pofData
 *
 */
const fillWithNeededVariable = root => {
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

/**
 * disable all tasks that are in use
 * @param {object} root - pofData
 * @param {string[]} existingActivityGuids - GUID:s of the activities in use
 * @return {object} pofData - with the correct activities disabled
 */
const disableTasksInFilterIfExists = (root, existingActivityGuids) => {
  const activityKeys = Object.keys(root.entities.activities)
  activityKeys.forEach(key => {
    const activity = root.entities.activities[key]
    activity.disabled = false
  })
  existingActivityGuids.forEach(key => {
    const task = root.entities.activities[key]
    task.disabled = true
  })
  return root
}

/**
 * disable optional tasks in tarppo and its child tarppos if all mandatory tasks are not selected
 *  @param {object} root - pofData
 *  @param {string[]} existingActivityGuids - GUID:s of the activities in use
 *  @return pofData
 */
const lockOptionalTasksIfMandatoryLeftToPickInAGroup = (
  root,
  existingActivityGuids
) => {
  if (!root) return root
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
        setChildrenTasksDisabled(key, root)
      }
    })
  })
  return root
}

const deepStateCopy = state => {
  const stateCopy = { ...state }
  stateCopy.entities = { ...state.entities }
  stateCopy.entities.activities = { ...state.entities.activities }
  Object.keys(state.entities.activities).forEach(key => {
    stateCopy.entities.activities[key] = { ...state.entities.activities[key] }
  })
  stateCopy.entities.tarppo = { ...state.entities.tarppo }
  Object.keys(state.entities.tarppo).forEach(key => {
    stateCopy.entities.tarppo[key] = { ...state.entities.tarppo[key] }
  })
  return stateCopy
}

/**
 * Disable used tasks and lock optional tasks if mandatory tasks
 * are not picked
 * @param state
 * @param {string[]} existingActivityGuids - GUID:s of activities in use
 */
const updateState = (state, existingActivityGuids) => {
  let updatedState = deepStateCopy(state)
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
    case 'INIT_TREE_POF': {
      // add variables and sort that TreeSearchBar uses
      const filledTree = fillWithNeededVariable(action.pofJson)
      return filledTree
    }
    case 'SET_TREE_POF': {
      return updateState(state, action.activities)
    }
    default: {
      return state
    }
  }
}

export const pofTreeInitialization = pofJson => ({
  type: 'INIT_TREE_POF',
  pofJson,
})

export const pofTreeUpdate = activities => ({
  type: 'SET_TREE_POF',
  activities: arrayActivityGuidsFromBufferAndEvents(activities),
})

export default reducer
