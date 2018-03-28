import { normalize, schema } from 'normalizr'

const createSchemas = () => {
  // Luo skeemat JSON datan normalisointia varten

  // Tämä hakee kaikki aktiviteetit
  const taskSchema = new schema.Entity('tasks', {}, { idAttribute: 'guid' })

  // Tämä hakee taskgroupit ja liittää niihin aktiviteettien guidin
  const taskgroupSchema = new schema.Entity(
    'taskgroups',
    { tasks: [taskSchema] },
    { idAttribute: 'guid' }
  )

  // Tämä hakee alitaskgroupit ja liittää guifit
  taskgroupSchema.define({ taskgroups: [taskgroupSchema] })

  return taskgroupSchema
}

// Palauta lista pelkistä aktiviteeteista

const activities = fetchedActivities => {
  if (!fetchedActivities) {
    console.log('No activities found yet!')
    return []
  }

  const programListSchema = createSchemas()
  const normalizedData = normalize(fetchedActivities, programListSchema)

  const { tasks } = normalizedData.entities

  return Object.values(tasks)
}

export default activities
