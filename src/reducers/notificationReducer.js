const reducer = (state = null, action) => {
  switch (action.type) {
    case 'NOTIFY':
      return action.message
    case 'RESET':
      return null
    default:
      return state
  }
}

export const notify = (message, type = 'success') => ({
  type: 'NOTIFY',
  message: {
    text: message,
    type: type,
    key: new Date().getTime(),
  },
})

export const resetNotify = () => {
  console.log('Notification reset!')
  return { type: 'RESET' }
}

/* TODO: Update functions that use notify */

export default reducer
