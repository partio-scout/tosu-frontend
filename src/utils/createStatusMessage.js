import findActivity from '../functions/findActivity'
import moment from 'moment-with-locales-es6'

const arrayActivityGuidsFromBufferAndEvents = (events, pofTree) => {
  let activities = []

  events.forEach(event => {
    event.activities.forEach(activity => {
      const found = findActivity(activity, pofTree)
      const savedActivity = Object.assign(
        { ...found },
        { date: event.startDate }
      )
      activities = activities.concat(savedActivity)
    })
  })
  return activities
}

const composeStatusMessage = (selectedActivities, taskgroup) => {
  let taskgroupDone = false
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
    majakka: 0,
    total: 0,
    done: false
  }
  let extraTask = 0

  const dates = {
    firstTask: null,
    mandatory: null,
    nonMandatory: null,
    leaderTask: null,
    suhdeItseen: null,
    suhdeToiseen: null,
    suhdeYhteiskuntaan: null,
    suhdeYmparistoon: null,
    majakka: null,
    extraTask: null
  }

  const warnings = {
    firstTaskTooLate: false,
    lastTaskTooSoon: false
  }

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
          dates.firstTask = activity.date
        }
        if (activity.label.match(/Johtamis- tai vastuutehtävä/)) {
          leaderTask += 1
          dates.leaderTask = activity.date
        }
        if (
          activity.tags.pakollisuus[0].name === 'Pakollinen' &&
          activity.order !== 0 &&
          !activity.label.match(/Johtamis- tai vastuutehtävä/)
        ) {
          mandatory += 1
          dates.mandatory = activity.date
        }
        if (
          activity.tags.pakollisuus[0].name !== 'Pakollinen' &&
          activity.order !== 0 &&
          activity.order !== 6 &&
          taskgroup.order !== 8
        ) {
          if (activity.label.match(/Suhde itseen/)) {
            nonMandatory.suhdeItseen += 1
            dates.suhdeItseen = activity.date
          } else if (activity.label.match(/Suhde toiseen/)) {
            nonMandatory.suhdeToiseen += 1
            dates.suhdeToiseen = activity.date
          } else if (activity.label.match(/Suhde ympäristöön/)) {
            nonMandatory.suhdeYmparistoon += 1
            dates.suhdeYmparistoon = activity.date
          } else if (activity.label.match(/Suhde yhteiskuntaan/)) {
            nonMandatory.suhdeYhteiskuntaan += 1
            dates.suhdeYhteiskuntaan = activity.date
          }
          if (activity.label.match(/Majakkavaihtoehto/)) {
            nonMandatory.majakka += 1
            dates.majakka = activity.date
          } else {
            nonMandatory.total += 1
            dates.nonMandatory = activity.date
          }
        }
        if (activity.order !== 8) {
          extraTask += 1
          dates.extraTask = activity.date
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

  if (firstTaskgroup) {
    if (mandatory === taskgroup.children.length) {
      taskgroupDone = true
    }
  } else if (lastTaskgroup) {
    if (mandatory === taskgroup.children.length) {
      taskgroupDone = true
    }
  } else if (!firstTaskgroup && !lastTaskgroup && !extraTaskgroup) {
    if (
      firstTask === 1 &&
      leaderTask === 1 &&
      mandatory === 5 &&
      nonMandatory.done &&
      nonMandatory.majakka === 1
    ) {
      taskgroupDone = true
    }
  }

  if (
    moment(dates.firstTask) > moment(dates.leaderTask) ||
    moment(dates.firstTask) > moment(dates.mandatory) ||
    moment(dates.firstTask) > moment(dates.nonMandatory) ||
    moment(dates.firstTask) > moment(dates.extraTask) ||
    moment(dates.firstTask) > moment(dates.majakka)
  ) {
    warnings.firstTaskTooLate = true
  }

  if (
    moment(dates.majakka) < moment(dates.firstTask) ||
    moment(dates.majakka) < moment(dates.leaderTask) ||
    moment(dates.majakka) < moment(dates.mandatory) ||
    moment(dates.majakka) < moment(dates.nonMandatory) ||
    moment(dates.majakka) < moment(dates.extraTask)
  ) {
    warnings.lastTaskTooSoon = true
  }

  const status = {
    taskgroupDone,
    firstTaskgroup,
    lastTaskgroup,
    extraTaskgroup,
    firstTask,
    mandatory,
    nonMandatory,
    leaderTask,
    extraTask,
    dates,
    warnings
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
