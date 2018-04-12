import actitivyService from '../services/activities'
import findActivity from '../functions/findActivity'

const arrayActivityGuidsFromBufferAndEvents = (events, pofTree) => {
  let activities = []

  events.forEach(event => {
    event.activities.forEach(activity => {
      const found = findActivity(activity, pofTree)
      activities = activities.concat(found)
    })
  })
  return activities
}

const createStatusMessage = (events, pofTree) => {
  const selectedActivities = arrayActivityGuidsFromBufferAndEvents(
    events,
    pofTree
  )

  let mandatory = 0
  let nonMandatory = 0

  if (selectedActivities.length !== 0) {
    selectedActivities.forEach(activity => {
      if (activity) {
        console.log(activity)
        if (activity.tags.pakollisuus[0].name === 'Pakollinen') {
          mandatory += 1
        } else {
          nonMandatory += 1
        }
      }
    })
  }
  const text = `Pakollisia valittu ${mandatory} ja vapaaehtoisia ${nonMandatory}`

  console.log('Teksti: ', text)
  return text
}

export { createStatusMessage }
