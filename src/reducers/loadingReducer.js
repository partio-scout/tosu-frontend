const reducer = (state = true, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return action.bool
    default:
      return state
  }
}

export const setLoading = bool => ({
  type: 'SET_LOADING',
  bool,
})

export default reducer
