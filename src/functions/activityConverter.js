/**
 * Methods that convert activities to backend elements
 * @param pofActivity activity that converted to a form that can be send to backend. Pof stands for PartioOhjelmaFi
 * @returns a object that can be send to the backend
 */
const convertToBackendActivity = pofActivity => {
  if (pofActivity === undefined || pofActivity === null) {
    return pofActivity
  }
  /**
   * Method that maps the leadership skills of the activity
   * @param activity activity that will get the mapped data
   * @param pofActivity activity where the data is mapped from
   */
  const johtamistaito = (activity, pofActivity) => {
    try {
      activity.johtamistaito = pofActivity.tags.johtamistaito.map(
        jtn => jtn.name
      )
    } catch (exception) {
      activity.johtamistaito = []
    }
  }
  /**
   * Method that maps the skill areas of the activity
   * @param activity activity that will get the mapped data
   * @param pofActivity activity where the data is mapped from
   */
  const taitoalueet = (activity, pofActivity) => {
    try {
      activity.taitoalueet = pofActivity.tags.taitoalueet.map(jtn => jtn.name)
    } catch (exception) {
      activity.taitoalueet = []
    }
  }
  /**
   * Method that maps the pedagogical goals of the activity
   * @param activity activity that will get the mapped data
   * @param pofActivity activity where the data is mapped from
   */
  const kasvatustavoitteet = (activity, pofActivity) => {
    try {
      activity.kasvatustavoitteet = pofActivity.tags.kasvatustavoitteet.map(
        jtn => jtn.name
      )
    } catch (exception) {
      activity.kasvatustavoitteet = []
    }
  }
  /**
   * Method that maps the suggestions of the activity
   * @param activity activity that will get the mapped data
   * @param pofActivity activity where the data is mapped from
   */
  const suggestions = (activity, pofActivity) => {
    try {
      activity.suggestions = pofActivity.suggestions_details.map(jtn => {
        const suggs = {
          title: jtn.title,
          content: jtn.content,
          guid: jtn.guid,
        }
        return suggs
      })
    } catch (exception) {
      console.log("failed conversion")
      activity.suggestions = []
    }
  }
  const backendActivity = {
    guid: pofActivity.guid,
    title: pofActivity.title.props.name,
    content: pofActivity.content,
    mandatory: pofActivity.isMandatory,
    ingress: pofActivity.ingress,
    leader_tasks: pofActivity.leader_tasks,
    duration: pofActivity.tags.suoritus_kesto.name,
    task_term: pofActivity.task_term.name,
    place: pofActivity.tags.paikka.map(jtn => jtn.name),
    mandatoryIconUrl: pofActivity.tags.pakollisuus[0].icon,
    originUrl: pofActivity.languages[0].details,
    parents: pofActivity.parents,
  }
  kasvatustavoitteet(backendActivity, pofActivity)
  taitoalueet(backendActivity, pofActivity)
  johtamistaito(backendActivity, pofActivity)
  suggestions(backendActivity, pofActivity)
  return backendActivity
}

export default convertToBackendActivity
