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
  let firstTask = 0
  let mandatory = 0
  let leaderTask = 0
  let nonMandatory = 0

  if (selectedActivities.length !== 0) {
    selectedActivities.forEach(activity => {
      if (activity && taskgroup) {
        if (activity.parents[2].guid === taskgroup.guid) {
          console.log(activity)
          if (activity.order === 0) {
            firstTask += 1
          }
          if (activity.order === 6) {
            leaderTask += 1
          }
          if (
            activity.tags.pakollisuus[0].name === 'Pakollinen' &&
            activity.order !== 0 && activity.order !== 6
          ) {
            mandatory += 1
          } else {
            nonMandatory += 1
          }
        }
      }
    })
  }
  const status = { firstTask, mandatory, nonMandatory, leaderTask }

  return status
}

export { createStatusMessage }
