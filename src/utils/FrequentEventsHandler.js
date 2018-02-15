import React from 'react'
import moment from "moment";


const handleFrequentEvent = (date, repeatFrequency, i) => {
  // Repeat every day
  if (repeatFrequency === 1) {
    if (i !== 0) {
      date = moment(date).add(i, 'days')
      console.log(date)
    }
  }

  // Repeat every week
  if (repeatFrequency === 2) {
    if (i !== 0) {
      date = moment(date).add(i, 'weeks')
      console.log(date)
    }
  }


// Repeat every other week
  if (repeatFrequency === 3) {
    if (i !== 0) {
      date = moment(date).add(i * 14, 'days')
      console.log(date)
    }
  }

  // Repeat every month
  if (repeatFrequency === 4) {
    if (i !== 0) {
      date = moment(date).add(i, 'months')
      console.log(date)
    }
  }

  return date
}

export default handleFrequentEvent
