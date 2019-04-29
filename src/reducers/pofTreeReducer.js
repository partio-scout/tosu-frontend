import React from 'react'
import { getActivityList } from './activityReducer'

/** @module pofTreeReducer */
// helpers
/*
 * put all picked activities from events and buffer into a string array made of their guid
 * we use that to search/filter from pofdata
 */
const arrayActivityGuidsFromBufferAndEvents = activities => {
  return getActivityList(activities).map(activity => activity.guid)
}
/**
 * Add variables used by TreeSearch component to the pofData
 * @method
 * @param {object} root - DEEP copy of pofData
 * @return {Object} poftree with TreeSearch compliant fields
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
 * @method
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
 * Disable one activity in treeSearchBar
 * @method
 * @param {Object} root - pofTree root object
 * @param {String} taskGUID - guid of the target task
 * @return {Object} newState - new state
 */
const disableTask = (root, taskGUID) => {
  const newActivities = { ...root.entities.activities }
  const activity = { ...newActivities[taskGUID], disabled: true }
  newActivities[taskGUID] = activity
  return { ...root, entities: { ...root.entities, activities: newActivities } }
}
/**
 * Enable one activity in TreeSearchBar
 * @method
 * @param {Object} root - pofTree root object
 * @param {String} taskGUID - guid of the target task
 * @return {Object} newState - newState 
 */
const enableTask = (root, taskGUID) => {
  const newActivities = { ...root.entities.activities }
  const activity = { ...newActivities[taskGUID], disabled: false }
  newActivities[taskGUID] = activity
  return { ...root, entities: { ...root.entities, activities: newActivities } }
}
/**
 * Create deep copy of the state
 * @method
 * @param {Object} state
 * @return {Object} StateCopy
 */
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
 * @method
 * @param state
 * @param {string[]} existingActivityGuids - GUID:s of activities in use
 * @return {Object} updatedState
 */
const updateState = (state, existingActivityGuids) => {
  let updatedState = deepStateCopy(state)
  updatedState = disableTasksInFilterIfExists(
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
    case 'DISABLE_ACTIVITY': {
      return disableTask(state, action.taskGUID)
    }
    case 'ENABLE_ACTIVITY': {
      return enableTask(state, action.taskGUID)
    }
    default: {
      return state
    }
  }
}

/**
 * Initialize pofTree
 * @method
 * @param {Object} pofJson - normalized pof json
 */
export const pofTreeInitialization = pofJson => ({
  type: 'INIT_TREE_POF',
  pofJson,
})

/**
 * Update poftree. Used to disable selected activities in TreeSearch
 * @method
 * @param {Object} activities - map of the activities in application state
 *
 */
export const pofTreeUpdate = activities => ({
  type: 'SET_TREE_POF',
  activities: arrayActivityGuidsFromBufferAndEvents(activities),
})

/**
 * Enable one activity in TreeSearchBar
 * @method
 * @param {String} GUID - guid for the activity
 */
export const enableActivity = GUID => ({
  type: 'ENABLE_ACTIVITY',
  taskGUID: GUID,
})
/**
 * Disable one activity in TreeSearchBar
 * @method
 * @param {String} GUID - guid for the activity 
 */
export const disableActivity = GUID => ({
  type: 'DISABLE_ACTIVITY',
  taskGUID: GUID,
})

export default reducer
