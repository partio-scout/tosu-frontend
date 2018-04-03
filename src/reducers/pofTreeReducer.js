import pofService from '../services/pof'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_TREE_POF':
      return postOrder(action.pofActivities)
    default:
      return state
  }

}

const postOrder = (pof) => {
  let root=pof
  if (root == null) return;

  root.taskgroups.forEach(postOrder);

  root.key = root.guid
  root.label = root.title
  root.value = root.guid
  root.children = [].concat(root.taskgroups).concat(root.tasks)

  
  if (root !== undefined && root.tasks !== undefined) {
  root.tasks.forEach(task => {

    task.key = task.guid
    task.label = task.title
    task.value = task.guid
  });
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