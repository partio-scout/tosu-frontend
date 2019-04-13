import moment from 'moment'

const handleFrequentEvent = (date, repeatFrequency, i) => {
  let newDate = moment(date)

  // Repeat every day
  if (repeatFrequency === 1) {
    if (i !== 0) {
      newDate = moment(date).add(i, 'days')
    }
  }

  // Repeat every week
  if (repeatFrequency === 2) {
    if (i !== 0) {
      newDate = moment(date).add(i, 'weeks')
    }
  }

  // Repeat every other week
  if (repeatFrequency === 3) {
    if (i !== 0) {
      newDate = moment(date).add(i * 14, 'days')
    }
  }

  // Repeat every month
  if (repeatFrequency === 4) {
    if (i !== 0) {
      newDate = moment(date).add(i, 'months')
    }
  }
  return newDate
}

export default handleFrequentEvent
