import pofService from '../services/pof'
import { blue200, blue500 } from 'material-ui/styles/colors';
import React from 'react'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_TREE_POF':
      return postOrderInit(action.pofActivities)
    case 'SET_TREE_POF':
      return updateState(state, action.existingActivityGuids)
    //return state
    default:
      return state
  }
}

export const pofTreeInitialization = () => {
  return async (dispatch) => {
    const pofActivities = await pofService.getAllTree()
    dispatch({
      type: 'INIT_TREE_POF',
      pofActivities
    })
  }
}

export const pofTreeUpdate = (buffer, events) => {
  return async (dispatch) => {
    const existingActivityGuids = arrayActivityGuidsFromBufferAndEvents(buffer, events)
    dispatch({
      type: 'SET_TREE_POF',
      existingActivityGuids: existingActivityGuids
    })
  }
}

const updateState = (state, existingActivityGuids) => {
  let updatedState = Object.assign({}, state)
  updatedState =  postOrderFilterExistingActivities(updatedState, existingActivityGuids)
  updatedState =  postOrderFilterAllIfMandatoryLeft(updatedState, existingActivityGuids)
  return updatedState
}


const postOrderFilterExistingActivities = (pof, existingActivityGuids) => {
  let root = pof
  if (root === null || root === undefined) return;
  root.taskgroups.forEach(group => postOrderFilterExistingActivities(group, existingActivityGuids))

  if (root !== undefined && root.tasks !== undefined) {
    root.children.forEach(task => {
      console.log(task.value, existingActivityGuids)
      if (existingActivityGuids.includes(task.value))
        task.disabled = true
      else {
        task.disabled = false
      }
    })
  }
  return root
}


const postOrderInit = (pof) => {
  let root = pof
  if (root === null) return;

  root.taskgroups.forEach(postOrderInit);

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
        task.title = <span name={task.title} style={{ backgroundColor: blue500 }}>{task.title}</span>
      } else {
        task.label = task.title
        task.title = <span name={task.title} style={{ backgroundColor: blue200 }}>{task.title}</span>
      }
    })
  }
  return root
};

//helpers
const arrayActivityGuidsFromBufferAndEvents = (buffer, events) => {
  let activities = []
  buffer.activities.forEach(activity => {
    activities = activities.concat(activity.guid)
  });
  events.forEach(event => {
    event.activities.forEach(activity => {
      activities = activities.concat(activity.guid)
    })
  })
  return activities
}

const orderSorter = (a, b) => {
  if (a.tags.pakollisuus[0].slug === 'mandatory' && b.tags.pakollisuus[0].slug === 'not_mandatory') {
    return -1
  } else if (b.tags.pakollisuus[0].slug === 'mandatory' && a.tags.pakollisuus[0].slug === 'not_mandatory') {
    return 1
  }
  return 0
}

export default reducer