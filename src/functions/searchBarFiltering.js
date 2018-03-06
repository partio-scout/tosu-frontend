import { activitiesArray } from '../components/Activities'

export const filterOffExistingOnes = (source, events, buffer) => {
  let toFilter = activitiesArray(source)
  let combinedEventActivities = events.map(event =>
    event.activities)
  combinedEventActivities = [].concat.apply([], combinedEventActivities);

  if (combinedEventActivities[0] === undefined) {
    return toFilter

  }

  combinedEventActivities.forEach(activity => {
    toFilter = toFilter.filter(pofRow => {
      return pofRow.guid.toString() !== activity.guid.toString()
    });
  });
  console.log(toFilter.length)
  return toFilter

}