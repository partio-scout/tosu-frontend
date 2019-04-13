import moment from 'moment'

const repeatCount = (date, repeatFrequency, lastDate) => {
  let newRepeatCount

  // Count date difference in days
  let dateDifference = moment(lastDate).diff(date, 'days')

  // Repeat every day
  if (repeatFrequency === 1) {
    if (dateDifference !== 0) {
      newRepeatCount = dateDifference +1
    }
  }

  // Repeat every week
  if (repeatFrequency === 2) {
    if (dateDifference !== 0) {
      newRepeatCount = Math.floor(dateDifference / 7) +1
    }
  }

  // Repeat every other week
  if (repeatFrequency === 3) {
    if (dateDifference !== 0) {
      newRepeatCount = Math.floor(dateDifference / 14) +1
    }
  }

  // Repeat every month
  if (repeatFrequency === 4) {
    if (dateDifference !== 0) {
      newRepeatCount = Math.floor(dateDifference / 30) +1
    }
  }
  return newRepeatCount
}

export default repeatCount
