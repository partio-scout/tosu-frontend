const convertToBackendActivity = (wut) => {
    const pakollisuus = (mandatory)  => (
    mandatory === "Pakollinen"
    )
    const backendActivity = {
      guid: wut.guid,
      title: wut.title,
      content: wut.content,
      mandatory: pakollisuus( wut.tags.pakollisuus[0].name),
      
      ingress: wut.ingress,
      leader_tasks: wut.leader_tasks,
      duration: wut.tags.suoritus_kesto.name,
      task_term: wut.task_term.name,
      place: wut.tags.paikka.map(jtn => (jtn.name)),
      johtamistaito: wut.tags.johtamistaito.map(jtn => (jtn.name)),
      kasvatustavoitteet: wut.tags.kasvatustavoitteet.map(jtn => (jtn.name)),
      taitoalueet: wut.tags.taitoalueet.map(jtn => (jtn.name)),
      suggestions: wut.suggestions_details.items.map(jtn => {
        const suggs ={
        title:jtn.title,
        content:jtn.content,
        guid:jtn.guid
        }
        return suggs
      }),
      mandatoryIconUrl: wut.tags.pakollisuus[0].icon,
      originUrl: wut.languages[0].details


    }

    return backendActivity
  }

  export default convertToBackendActivity