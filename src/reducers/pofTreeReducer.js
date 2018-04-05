import pofService from '../services/pof'
import { blue50, blue500 } from 'material-ui/styles/colors'
import React from 'react'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_TREE_POF':
      //add variables that TreeSearchBar uses
      return postOrderInit(action.pofActivities)
    case 'SET_TREE_POF':
      //update data by diasbling existing activities &
      // locking non-mandatory tasks if a tarppo has mandatort tasks left to pick
      return updateState(state, action.existingActivityGuids)
    default:
      return state
  }
}

export const pofTreeInitialization = () => {
  return async dispatch => {
    const pofActivities = await pofService.getAllTree()
    dispatch({
      type: 'INIT_TREE_POF',
      pofActivities
    })
  }
}

export const pofTreeUpdate = (buffer, events) => {
  return async dispatch => {
    const existingActivityGuids = arrayActivityGuidsFromBufferAndEvents(
      buffer,
      events
    )
    dispatch({
      type: 'SET_TREE_POF',
      existingActivityGuids: existingActivityGuids
    })
  }
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

const lockOptionalTasksIfMandatoryLeftToPickInAGroup = (
  pof,
  existingActivityGuids
) => {
  pof.taskgroups.forEach(majorTaskGroup => {
    const mandatoryTaskGuids = majorTaskGroup.mandatory_tasks.split(',') //mandatory tasks are listed in major group
    if (mandatoryTaskGuids[0] === '') {
      //empty split return and array with only value as ""
      return
    }
    //if existing activities do not contain all mandatory tasks -> disable all optional
    mandatoryTaskGuids.forEach(mandatoryTaskGuid => {
      if (existingActivityGuids.includes(mandatoryTaskGuid) === false) {
        setChildrenTasksDisabled(majorTaskGroup)
      }
    })
  })
  return pof
}
//recursively go into taskgroups of taskgroups and disable all optional tasks
const setChildrenTasksDisabled = pofChild => {
  let root = pofChild
  if (root === null || root === undefined) return
  if (root.children !== undefined) {
    //groups have children, tasks do not ->recursion into groups
    root.children.forEach(setChildrenTasksDisabled)
  }
  if (root.tasks === undefined) {
    //it's a task
    if (root.tags.pakollisuus[0].slug !== 'mandatory') {
      root.disabled = true
    }
  }
}

//recursively disable existing tasks and enable if removed
const disableTasksInFilterIfExists = (root, existingActivityGuids) => {
  if (root === null || root === undefined) return
  root.taskgroups.forEach(group =>
    disableTasksInFilterIfExists(group, existingActivityGuids)
  )

  if (root !== undefined && root.tasks !== undefined) {
    root.children.forEach(task => {
      if (existingActivityGuids.includes(task.value)) task.disabled = true
      else {
        task.disabled = false
      }
    })
  }
  return root
}
console.log('wop')
//TreeSearchBar needs specific variables addedto our pofdata
//which is done here recursively
const postOrderInit = pof => {
  let root = pof
  if (root === null) return

  root.taskgroups.forEach(postOrderInit)

  root.key = root.guid
  root.label = root.title
  root.title = <span name={root.title}>{root.title}</span>
  root.value = root.guid
  root.children = [].concat(root.taskgroups)

  if (root !== undefined && root.tasks !== undefined) {
    root.children = root.children.concat(root.tasks.sort(orderSorter))
    root.tasks.forEach(task => {
      task.key = task.guid
      task.value = task.guid
      if (task.tags.pakollisuus[0].slug === 'mandatory') {
        task.label = task.title
        task.title = (
          <span
            name={task.title}
            className="tree-search-title-span"
            style={{ backgroundColor: blue500 }}
          >
            {task.title}
          </span>
        )
      } else {
        task.label = task.title
        task.title = (
          <span
            name={task.title}
            className="tree-search-title-span"
            style={{ backgroundColor: blue50 }}
          >
            {task.title}
          </span>
        )
      }
    })
  }
  return root
}

//helpers
//put all picked activities from events and buffer into a string array made of their guid
//we use that to search/filter from pofdata
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
//pof contains a specific order which is why we sort
const orderSorter = (a, b) => {
  if (
    a.tags.pakollisuus[0].slug === 'mandatory' &&
    b.tags.pakollisuus[0].slug === 'not_mandatory'
  ) {
    return -1
  } else if (
    b.tags.pakollisuus[0].slug === 'mandatory' &&
    a.tags.pakollisuus[0].slug === 'not_mandatory'
  ) {
    return 1
  }
  return 0
}

export default reducer
