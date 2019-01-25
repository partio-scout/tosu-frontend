const reducer = (state=true, action) => {
  console.log(action)
  switch (action.type) {
    case 'SET_LOADING':
      return action.bool
    default:
      return state
  }
}

export const setLoading = (bool) => {
  return {
    type: 'SET_LOADING',
    bool
  }
}

export default reducer
