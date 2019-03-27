const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SIDEBAR':
      return { ...state, sideBarVisible: action.value }
    default:
      return state
  }
}

const initialState = {
  sideBarVisible: true,
}

export const setSideBar = value => ({
  type: 'SET_SIDEBAR',
  value,
})

export default reducer
