import { normalize, schema } from 'normalizr'

const suggestion = new schema.Entity('suggestions', {}, { idAttribute: 'guid' })

const activity = new schema.Entity(
  'activities',
  {
    suggestions_details: [suggestion],
  },
  { idAttribute: 'guid' }
)

const eventActivity = new schema.Entity('activities', {}, { idAttribute: 'id' })
const event = new schema.Entity(
  'events',
  {
    activities: [eventActivity],
  },
  { idAttribute: 'id' }
)

export const eventSchema = new schema.Array(event)

const tarppo = new schema.Entity(
  'tarppo',
  {
    tasks: [activity],
  },
  { idAttribute: 'guid' }
)

tarppo.define({ taskgroups: [tarppo] })

export const pofTreeSchema = new schema.Entity(
  'poftree',
  {
    taskgroups: [tarppo],
  },
  { idAttribute: 'guid' })

export default pofTreeSchema
