function iterateTimeSlots(startTime, endTime, sessionDuration, pauseDuration) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMinute = startMinute;

  const periods = [];

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const sessionEndTime = new Date(
      1970,
      0,
      1,
      currentHour,
      currentMinute + sessionDuration,
      0
    );

    periods.push([
      `${currentHour.toString().padStart(2, "0")}:${currentMinute
        .toString()
        .padStart(2, "0")}`,
      `${sessionEndTime.getHours().toString().padStart(2, "0")}:${sessionEndTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
    ]);

    currentMinute += sessionDuration + pauseDuration;

    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute %= 60;
    }
  }

  return periods;
}

function loopWeekdays(
  startDay,
  endDay,
  selectedDay,
  firstSession,
  secondSession,
  callback
) {
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const startIndex = weekdays.indexOf(startDay);
  const endIndex = weekdays.indexOf(endDay);
  const selectedIndex = weekdays.indexOf(selectedDay);
  const sessions = [firstSession, secondSession];

  if (selectedIndex < startIndex || selectedIndex > endIndex) {
    console.log("Invalid selected day.");
    return;
  }

  if (startIndex === -1 || endIndex === -1) {
    console.log("Invalid start or end day.");
    return;
  }

  if (startIndex > endIndex) {
    console.log("Start day should be before end day.");
    return;
  }

  const selectedDays = weekdays.slice(startIndex, endIndex + 1);

  const result = {};

  selectedDays.forEach((day, index) => {
    const periods = [];
    callback(day, index === 0, sessions, (period) => {
      periods.push(period);
    });
    result[day] = periods;
  });

  return result;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isIntersected(period, startTime, endTime) {
  // Check if startTime or endTime is empty or undefined
  if (!startTime || !endTime) {
    return false;
  }

  const [start1, end1] = period.map(timeToMinutes);
  const start2 = timeToMinutes(startTime);
  const end2 = timeToMinutes(endTime);

  return Math.max(start1, start2) < Math.min(end1, end2);
}

function timeToMinutesTimeTable(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

module.exports = {
  isIntersected,
  iterateTimeSlots,
  loopWeekdays,
  timeToMinutesTimeTable,
};
