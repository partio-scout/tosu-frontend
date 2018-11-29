import moment from 'moment'
import findActivity from '../functions/findActivity'

const arrayActivityGuidsFromBufferAndEvents = (events, pofTree) => {
  let activities = []

  // Get all activities that are in one of the events
  events.forEach(event => {
    event.activities.forEach(activity => {
      // Get information about activity from pofdata
      const found = findActivity(activity, pofTree)

      // Save the date of the event when activity is planned
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
  // Initialize needed variables

  // Taskgroup info
  let taskgroupDone = false
  let firstTaskgroup = false
  let lastTaskgroup = false
  let extraTaskgroup = false

  // Task counters
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
  let extraTask = {
    suhdeItseen: 0,
    suhdeToiseen: 0,
    suhdeYhteiskuntaan: 0,
    suhdeYmparistoon: 0,
    total: 0
  }

  // Task dates
  const dates = {
    firstTask: null,
    firstMandatory: null,
    lastMandatory: null,
    firstNonMandatory: null,
    lastNonMandatory: null,
    leaderTask: null,
    suhdeItseen: null,
    suhdeToiseen: null,
    suhdeYhteiskuntaan: null,
    suhdeYmparistoon: null,
    majakka: null,
    extraTask: null
  }


  // Warnings about order of tasks
  const warnings = {
    firstTaskTooLate: false,
    lastTaskTooSoon: false
  }

  // Check if taskgroup is one of the special groups

  // Tervetuloa tarpojaksi
  if (taskgroup.order === 0) {
    firstTaskgroup = true
  }

  // Paussit
  if (taskgroup.order === 7) {
    extraTaskgroup = true
  }

  // Siirtymä
  if (taskgroup.order === 8) {
    lastTaskgroup = true
  }

  selectedActivities.forEach(activity => {
    if (activity && taskgroup) {
      // Check if activity belongs to selected taskgroup
      if (activity.parents[2].guid === taskgroup.guid) {
        // Check activity is first task (suuntaus)
        if (activity.order === 0) {
          firstTask += 1
          dates.firstTask = activity.date
        }

        // Check if activity is johtamis- tai vastuutehtävä
        if (activity.label.match(/Johtamis- tai vastuutehtävä/)) {
          leaderTask += 1
          dates.leaderTask = activity.date
        }else if (activity.isMandatory && activity.order !== 0) { // Chek if activity is another mandatory task (but not johtamis- tai vastuutehtävä)
          mandatory += 1
          if (! (moment(activity.date) > moment(dates.firstMandatory))) {
            dates.firstMandatory = activity.date
          }
          if (! (moment(activity.date) < moment(dates.lastMandatory))) {
            dates.lastMandatory = activity.date
          }
        }

        // Check if activity is nonMandatory
        if (
          !activity.isMandatory &&
          activity.order !== 0 &&
          activity.order !== 6 &&
          taskgroup.order !== 8
        ) {
          // Check in which relationship (suhde) activity belongs to
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

          // Check if activity is majakkavaihtoehto
          if (activity.label.match(/Majakkavaihtoehto/)) {
            nonMandatory.majakka += 1
            dates.majakka = activity.date
          } else {
            if (! (moment(activity.date) > moment(dates.firstNonMandatory))) {
              dates.firstNonMandatory = activity.date
            }
            if (! (moment(activity.date) < moment(dates.lastNonMandatory))) {
              dates.lastNonMandatory = activity.date
            }
          }
        }

        // Check if activity is paussi
        if (activity.parents[2].guid === '5f6c4cefac801370cd255dd36e6dacbf') {
          if (activity.parents[3].title.match(/Suhde itseen/)) {
            extraTask.suhdeItseen += 1
          } else if (activity.parents[3].title.match(/Suhde toiseen/)) {
            extraTask.suhdeToiseen += 1
          } else if (activity.parents[3].title.match(/Suhde ympäristöön/)) {
            extraTask.suhdeYmparistoon += 1
          } else if (activity.parents[3].title.match(/Suhde yhteiskuntaan/)) {
            extraTask.suhdeYhteiskuntaan += 1
          }

          extraTask.total += 1
          dates.extraTask = activity.date
        }
      }
    }
  })

  // Check if all needed acitivites are picked if selected taskgroup is first or last one
  if (firstTaskgroup || lastTaskgroup) {
    if (mandatory === taskgroup.children.length) {
      taskgroupDone = true
    }
  }
  
  nonMandatory.total = (nonMandatory.suhdeItseen >= 1) + (nonMandatory.suhdeToiseen >= 1) + (nonMandatory.suhdeYhteiskuntaan >= 1) + (nonMandatory.suhdeYmparistoon >= 1)
  // Check if needed non-mandatory activities have been picked for taskgroup
  if (nonMandatory.total === 4) {
    nonMandatory.done = true
  }

  // Check if all needed mandatory task have been picked for normal taskgroup (tarppo)
  if (!firstTaskgroup && !lastTaskgroup && !extraTaskgroup) {
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

  // Check if first task (suuntaus) is the first one planned
  if (
    moment(dates.firstTask) > moment(dates.leaderTask) ||
    moment(dates.firstTask) > moment(dates.firstMandatory) ||
    moment(dates.firstTask) > moment(dates.firstNonMandatory) ||
    moment(dates.firstTask) > moment(dates.extraTask) ||
    moment(dates.firstTask) > moment(dates.majakka)
  ) {
    warnings.firstTaskTooLate = 'Suuntaus on suoritettava ennen muita aktiviteetteja'
  }

  // Check if the last task (majakka) is the last one planned
  if (
    moment(dates.majakka) < moment(dates.firstTask) ||
    moment(dates.majakka) < moment(dates.leaderTask) ||
    moment(dates.majakka) < moment(dates.lastMandatory) ||
    moment(dates.majakka) < moment(dates.lastNonMandatory) ||
    moment(dates.majakka) < moment(dates.extraTask)
  ) {
    warnings.lastTaskTooSoon = 'Majakka on suoritettava viimeisenä'
  }


  // If taskgroup has warnings don't set taskgroup done even if enough activities have been planned
  if (warnings.lastTaskTooSoon || warnings.firstTaskTooLate) {
    taskgroupDone = false
  }

  // Format dates
  dates.firstTask = moment(dates.firstTask).format('DD.MM.YYYY')
  dates.leaderTask = moment(dates.leaderTask).format('DD.MM.YYYY')
  dates.mandatory = moment(dates.mandatory).format('DD.MM.YYYY')
  dates.nonMandatory = moment(dates.nonMandatory).format('DD.MM.YYYY')
  dates.suhdeItseen = moment(dates.suhdeItseen).format('DD.MM.YYYY')
  dates.suhdeToiseen = moment(dates.suhdeToiseen).format('DD.MM.YYYY')
  dates.suhdeYhteiskuntaan = moment(dates.suhdeYhteiskuntaan).format('DD.MM.YYYY')
  dates.suhdeYmparistoon = moment(dates.suhdeYmparistoon).format('DD.MM.YYYY')
  dates.majakka = moment(dates.majakka).format('DD.MM.YYYY')
  dates.extraTask = moment(dates.extraTask).format('DD.MM.YYYY')

  // Return status object which contains all the information
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
