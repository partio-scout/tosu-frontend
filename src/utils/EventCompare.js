const compareEvents = (a, b) => {
  if(a.startDate < b.startDate ) {
    return -1
  } 
  if (b.startDate < a.startDate) {
    return 1
  }
  if (a.startTime < b.startTime){
    return -1
  }
  if (b.startTime < a.startTime) {
    return 1
  }
  return 0
}

export default compareEvents