const convertToBackendActivity = (pofActivity) => {
  if (pofActivity === undefined || pofActivity === null) {
    return pofActivity
  }

  const johtamistaito = (activity, pofActivity) => {
    try {
      activity.johtamistaito = pofActivity.tags.johtamistaito.map(jtn => (jtn.name))
    } catch (exception) {
      activity.johtamistaito = []
    }
  }
  const taitoalueet = (activity, pofActivity) => {
    try {
      activity.taitoalueet = pofActivity.tags.taitoalueet.map(jtn => (jtn.name))
    } catch (exception) {
      activity.taitoalueet = []
    }
  }
  const kasvatustavoitteet = (activity, pofActivity) => {
    try {
      activity.kasvatustavoitteet = pofActivity.tags.kasvatustavoitteet.map(jtn => (jtn.name))
    } catch (exception) {
      activity.kasvatustavoitteet = []
    }
  }
  const suggestions = (activity, pofActivity) => {
    try {
      activity.suggestions = pofActivity.suggestions_details.map(jtn => {
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
    guid: pofActivity.guid,
    title: pofActivity.title.props.name,
    content: pofActivity.content,
    mandatory: pofActivity.isMandatory,
    ingress: pofActivity.ingress,
    leader_tasks: pofActivity.leader_tasks,
    duration: pofActivity.tags.suoritus_kesto.name,
    task_term: pofActivity.task_term.name,
    place: pofActivity.tags.paikka.map(jtn => (jtn.name)),
    mandatoryIconUrl: pofActivity.tags.pakollisuus[0].icon,
    originUrl: pofActivity.languages[0].details,
    parents: pofActivity.parents
  }
  kasvatustavoitteet(backendActivity, pofActivity)
  taitoalueet(backendActivity, pofActivity)
  johtamistaito(backendActivity, pofActivity)
  suggestions(backendActivity, pofActivity)
  return backendActivity
}

export default convertToBackendActivity