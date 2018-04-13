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

const composeStatusMessage = (selectedActivities, taskgroup) => {
  let firstTaskgroup = false
  let firstTask = 0
  let mandatory = 0
  let leaderTask = 0
  let nonMandatory = 0

  if (taskgroup.order === 0) {
    firstTaskgroup = true
  }

  selectedActivities.forEach(activity => {
    if (activity && taskgroup) {
      if (activity.parents[2].guid === taskgroup.guid) {
        if (activity.order === 0) {
          firstTask += 1
        }
        if (activity.order === 6) {
          leaderTask += 1
        }
        if (
          activity.tags.pakollisuus[0].name === 'Pakollinen' &&
          activity.order !== 0 &&
          activity.order !== 6
        ) {
          mandatory += 1
        } else {
          nonMandatory += 1
        }
      }
    }
  })
  const status = {
    firstTaskgroup,
    firstTask,
    mandatory,
    nonMandatory,
    leaderTask
  }
  return status
}

const createStatusMessage = (events, pofTree, taskgroup) => {
  console.log('Create new status message')
  const selectedActivities = arrayActivityGuidsFromBufferAndEvents(
    events,
    pofTree
  )

  let status = {}

  if (selectedActivities && taskgroup) {
    status = composeStatusMessage(selectedActivities, taskgroup)
  }

  return status
}

export { createStatusMessage }
