import moment from 'moment'

const handleFrequentEvent = (date, repeatFrequency, i) => {
  // Repeat every day
  if (repeatFrequency === 1) {
    if (i !== 0) {
      date = moment(date).add(i, 'days')
    }
  }

  // Repeat every week
  if (repeatFrequency === 2) {
    if (i !== 0) {
      date = moment(date).add(i, 'weeks')
    }
  }

  // Repeat every other week
  if (repeatFrequency === 3) {
    if (i !== 0) {
      date = moment(date).add(i * 14, 'days')
    }
  }

  // Repeat every month
  if (repeatFrequency === 4) {
    if (i !== 0) {
      date = moment(date).add(i, 'months')
    }
  }

  return date
}

export default handleFrequentEvent
