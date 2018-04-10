const convertToBackendActivity = (wut) => {
  if (wut === undefined || wut === null) {
    return wut
  }
  const pakollisuus = (mandatory) => (
    mandatory === "Pakollinen"
  )
  const johtamistaito = (activity, wut) => {
    try {
      activity.johtamistaito = wut.tags.johtamistaito.map(jtn => (jtn.name))
    } catch (exception) {
      activity.johtamistaito = []
    }
  }
  const suggestions = (activity, wut) => {
    try {
      activity.suggestions = wut.suggestions_details.items.map(jtn => {
        const suggs = {
          title: jtn.title,
          content: jtn.content,
          guid: jtn.guid
        }
        return suggs
      })
    } catch (exception) {
      activity.suggestions = []
    }
  }
  let backendActivity = {
    guid: wut.guid,
    title: wut.title,
    content: wut.content,
    mandatory: pakollisuus(wut.tags.pakollisuus[0].name),

    ingress: wut.ingress,
    leader_tasks: wut.leader_tasks,
    duration: wut.tags.suoritus_kesto.name,
    task_term: wut.task_term.name,
    place: wut.tags.paikka.map(jtn => (jtn.name)),
    kasvatustavoitteet: wut.tags.kasvatustavoitteet.map(jtn => (jtn.name)),
    taitoalueet: wut.tags.taitoalueet.map(jtn => (jtn.name)),
    mandatoryIconUrl: wut.tags.pakollisuus[0].icon,
    originUrl: wut.languages[0].details


  }
  johtamistaito(backendActivity, wut)
  suggestions(backendActivity, wut)
  return backendActivity
}

export default convertToBackendActivity