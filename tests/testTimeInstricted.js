function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isIntersected(period1, period2) {
  const [start1, end1] = period1.map(timeToMinutes);
  const [start2, end2] = period2.map(timeToMinutes);
  return Math.max(start1, start2) < Math.min(end1, end2);
}

// Example usage:
const period1 = ["08:00", "10:00"]; // 08:00AM-10:00AM
const period2 = ["09:00", "11:00"]; // 09:00AM-11:00AM
const intersection = isIntersected(period1, period2);
console.log("Periods intersected:", intersection);
