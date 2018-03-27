
const filterOffExistingOnes = (source, events, buffer) => {
  let toFilter = source;
  let combinedEventActivities = events.map(event => event.activities);
  combinedEventActivities = [].concat.apply([], combinedEventActivities);

  if (buffer !== undefined) {
    combinedEventActivities = [].concat.apply(combinedEventActivities, buffer.activities);

  }
  if (combinedEventActivities[0] === undefined) {
    return toFilter;
  }


  combinedEventActivities.forEach(activity => {
    toFilter = toFilter.filter(pofRow => {
      return pofRow.guid.toString() !== activity.guid.toString()
    })
  });

  const compare = (a, b) => {
    if (a.mandatory && !b.mandatory) {
      return -1;
    } else if (!a.mandatory && b.mandatory) {
      return 1;
    }
    return 0;
  }

  const sortedPofActivities = toFilter.sort(compare);
  return sortedPofActivities;
};

export default filterOffExistingOnes
