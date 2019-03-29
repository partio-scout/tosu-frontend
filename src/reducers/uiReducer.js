const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SIDEBAR':
      return { ...state, sideBarVisible: action.value }
    case 'SET_VIEW':
      return { ...state, view: action.filter }
    default:
      return state
  }
}

const initialState = {
  sideBarVisible: true,
  view: 'OWN',
}

export const setSideBar = value => ({
  type: 'SET_SIDEBAR',
  value,
})

export const viewChange = filter => ({
  type: 'SET_VIEW',
  filter,
})

export default reducer
