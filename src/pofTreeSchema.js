import { normalize, schema } from 'normalizr'

const plan = new schema.Entity('plans')

const activity = new schema.Entity(
  'activities',
  {
    plans: [plan],
  },
  { idAttribute: 'guid' }
)

const event = new schema.Entity('events', {
  activities: [activity],
})


const tarppo = new schema.Entity(
  'tarppo',
  {
    tasks: [activity],
  },
  { idAttribute: 'guid' }
)

tarppo.define({ taskgroups: [tarppo] }) 

const pofTree = new schema.Entity('poftree', {
  taskgroups: [tarppo],
})

export default pofTree
