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

const createStatusMessage = (events, pofTree, taskgroup) => {
  const selectedActivities = arrayActivityGuidsFromBufferAndEvents(
    events,
    pofTree
  )

  let mandatory = 0
  let nonMandatory = 0

  if (selectedActivities.length !== 0) {
    selectedActivities.forEach(activity => {
      if (activity && taskgroup) {
        if(activity.parents[2].guid === taskgroup.guid){
        if (activity.tags.pakollisuus[0].name === 'Pakollinen') {
          mandatory += 1
        } else {
          nonMandatory += 1
        }
      }
      }
    })
  }
  const status = {mandatory, nonMandatory}

  return status
}

export { createStatusMessage }
