import activitiesArray from '../utils/NormalizeActivitiesData';

const filterOffExistingOnes = (source, events) => {
  let toFilter = source;
  console.log('toFilter1 ', toFilter)
  let combinedEventActivities = events.map(event => event.activities);
  combinedEventActivities = [].concat.apply([], combinedEventActivities);

  if (combinedEventActivities[0] === undefined) {
    return toFilter;
  }

  combinedEventActivities.forEach(activity => {
    toFilter = toFilter.filter(pofRow => {
      return pofRow.guid.toString() !== activity.guid.toString()
    })
  });
  return toFilter;
};

export default filterOffExistingOnes;
