const reducer = (store = null, action) => {
    if (action.type === 'NOTIFY') {
        return action.note
    } else if (action.type === 'CLEAR_NOTIFICATION') {
        return null
    }
    return store
}

export const notify = (text, textType = 'error', timeout = 5) => {
    return async (dispatch) => {
        dispatch(showNotification(text, textType))

        setTimeout(() => {
            dispatch(hideNotification())
        }, timeout * 1000)
    }
}
const showNotification = (text, textType) => {
    const note = {text: text, textType: textType}
    return { type: 'NOTIFY', note }
}
const hideNotification = () => {
    return { type: 'CLEAR_NOTIFICATION' }
}

export default reducer