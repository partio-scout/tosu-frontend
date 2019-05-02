import PropTypes from 'prop-types'

export const eventShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number,PropTypes.string]).isRequired,
  type: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  kuksaEventId: PropTypes.string,
  synced: PropTypes.bool,
  activities: PropTypes.arrayOf(PropTypes.number).isRequired,
})

export const pofTreeShape = PropTypes.shape({})

export const eventStoreShape = PropTypes.shape({})

export const scoutShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
})

export const bufferShape = PropTypes.shape({
  activities: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  id: PropTypes.number.isRequired,
})

export const taskgroupShape = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
})

export const classesShape = PropTypes.shape({
  label: PropTypes.string,
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
