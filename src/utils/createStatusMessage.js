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
  let lastTaskgroup = false
  let extraTaskgroup = false
  let firstTask = 0
  let mandatory = 0
  let leaderTask = 0
  const nonMandatory = {
    suhdeItseen: 0,
    suhdeToiseen: 0,
    suhdeYhteiskuntaan: 0,
    suhdeYmparistoon: 0,
    total: 0,
    done: false
  }
  let extraTask = 0

  if (taskgroup.order === 0) {
    firstTaskgroup = true
  }

  if (taskgroup.order === 7) {
    extraTaskgroup = true
  }

  if (taskgroup.order === 8) {
    lastTaskgroup = true
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
          activity.order !== 6 &&
          taskgroup.order !== 8
        ) {
          mandatory += 1
        }
        if (
          activity.tags.pakollisuus[0].name !== 'Pakollinen' &&
          activity.order !== 0 &&
          activity.order !== 6 &&
          taskgroup.order !== 8
        ) {
          if (activity.label.match(/Suhde itseen/)) {
            nonMandatory.suhdeItseen += 1
          } else if (activity.label.match(/Suhde toiseen/)) {
            nonMandatory.suhdeToiseen += 1
          } else if (activity.label.match(/Suhde ympäristöön/)) {
            nonMandatory.suhdeYmparistoon += 1
          } else if (activity.label.match(/Suhde yhteiskuntaan/)) {
            nonMandatory.suhdeYhteiskuntaan += 1
          }
          nonMandatory.total += 1
        }
        if (activity.order !== 8) {
          extraTask += 1
        }
      }
    }
  })

  if (
    nonMandatory.suhdeItseen >= 1 &&
    nonMandatory.suhdeToiseen >= 1 &&
    nonMandatory.suhdeYhteiskuntaan >= 1 &&
    nonMandatory.suhdeYmparistoon >= 1
  ) {
    nonMandatory.done = true
  }
  
  const status = {
    firstTaskgroup,
    lastTaskgroup,
    extraTaskgroup,
    firstTask,
    mandatory,
    nonMandatory,
    leaderTask,
    extraTask
  }
  return status
}

const createStatusMessage = (events, pofTree, taskgroup) => {
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
