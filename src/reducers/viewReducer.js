const viewReducer = (state = 'OWN', action) => {
  switch (action.type) {
    case 'SET_VIEW':
      return action.filter
    default:
      return state
  }
}

export const viewChange = filter => ({
    type: 'SET_VIEW',
    filter,
  })

export default viewReducer
