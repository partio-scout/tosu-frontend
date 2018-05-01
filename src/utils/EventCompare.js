const compareEvents = (a, b) => {
  if(a.startDate < b.startDate) {
    return -1
  } else if (b.startDate < a.startDate) {
    return 1
  }
  return 0
}

export default compareEvents