import pofService from '../services/pof'
import { blue200, blue500 } from 'material-ui/styles/colors';
import React from 'react'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_TREE_POF':
      return postOrder(action.pofActivities)
    default:
      return state
  }

}

const orderSorter = (a, b) => {
  if (a.tags.pakollisuus[0].slug === 'mandatory' && b.tags.pakollisuus[0].slug === 'not_mandatory') {
    return -1
  } else if (b.tags.pakollisuus[0].slug === 'mandatory' && a.tags.pakollisuus[0].slug === 'not_mandatory') {
    return 1
  }
  return 0
}

const postOrder = (pof) => {
  let root = pof
  if (root == null) return;

  root.taskgroups.forEach(postOrder);

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

export const pofTreeInitialization = () => {
  return async (dispatch) => {
    const pofActivities = await pofService.getAllTree()
    dispatch({
      type: 'INIT_TREE_POF',
      pofActivities
    })
  }
}

export default reducer