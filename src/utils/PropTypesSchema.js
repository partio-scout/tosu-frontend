import PropTypes from 'prop-types'
//

export const eventShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  kuksaEventId: PropTypes.number,
  synced: PropTypes.bool,
  activities: PropTypes.arrayOf(PropTypes.string).isRequired,
})

export const pofTreeShape = PropTypes.shape({
  taskgroups: PropTypes.arrayOf(PropTypes.object).isRequired,
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
})

export const scoutShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
})

export const bufferShape = PropTypes.shape({
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.number.isRequired,
})

export const taskgroupShape = PropTypes.shape({
  value: PropTypes.number.isRequired,
})

export const classesShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
})

export const dataShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  synced: PropTypes.bool,
  eventGroupId: PropTypes.number,
  kuksaEvent: PropTypes.object,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  information: PropTypes.string.isRequired,
})

export const storeShape = PropTypes.shape({
  getState: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
})

export default {
  eventShape,
  pofTreeShape,
  scoutShape,
  taskgroupShape,
  bufferShape,
  classesShape,
  dataShape,
  storeShape,
}
