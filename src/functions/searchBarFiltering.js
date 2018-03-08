const filterOffExistingOnes = (source, events, buffer) => {
  let toFilter = source;

  //combine into 1 array
  let combinedEventActivities = events.map(event => event.activities);
  combinedEventActivities = [].concat.apply([], combinedEventActivities);
  if (buffer !== undefined) {
    combinedEventActivities = [].concat.apply(combinedEventActivities, buffer.activities)
  } 

  //nothing to filter
  if (combinedEventActivities[0] === undefined) {
    return toFilter;
  }

  combinedEventActivities.forEach(activity => {
    toFilter = toFilter.filter(pofRow => {
      return pofRow.guid.toString() !== activity.guid.toString();
    });
  });

  return toFilter;
};

export default filterOffExistingOnes;
