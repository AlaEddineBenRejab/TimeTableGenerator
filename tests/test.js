// Function to check if the two periods are cross each other
function isIntersected(period1, period2) {
  const [start1, end1] = period1;
  const [start2, end2] = period2;
  return Math.max(start1, start2) < Math.min(end1, end2);
}

// Example usage:
const period1 = [8, 10]; // 08AM-10AM
const period2 = [10, 11]; // 09AM-11AM
const intersection = isIntersected(period1, period2);
console.log("Periods intersected:", intersection);

function isIntersected(period1, period2) {
  const [start1, end1] = period1;
  const [start2, end2] = period2;
  return Math.max(start1, start2) < Math.min(end1, end2);
}

const period11 = [8, 10]; // 08AM-10AM
const period12 = [10, 12]; // 10AM-12PM
const period13 = [11, 13]; // 11AM-01PM
const periods = [period11, period12, period13];

for (let i = 0; i < periods.length; i++) {
  if (isIntersected(periods[i], [12, 14]) === true) {
    // Check if the period intersects with [13, 14]
    console.log("Classroom occupied at period:", periods[i]);
    // If the classroom is occupied during this period, return false
    // Here you might want to handle what to do when the classroom is occupied
    // For now, let's just log a message
    return false;
  }
}

// If the loop completes without finding any intersection, it means the classroom is available
console.log("Classroom available for the given period.");
return true;

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
    console.log("Invalid slected day.");
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

  selectedDays.forEach((day, index) => {
    callback(day, index === 0, sessions); // Pass a flag indicating whether it's the first day
  });
}

function iterateTimeSlots(
  startTime,
  endTime,
  sessionDuration,
  pauseDuration,
  isFirstDay
) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMinute = startMinute;

  if (!isFirstDay) {
    // Skip the first iteration if it's not the first day
    // Calculate session end time considering potential hour rollover
    const sessionEndTime = new Date(
      1970,
      0,
      1,
      currentHour,
      currentMinute + sessionDuration,
      0
    );

    // Format and print session time slot
    console.log(
      `${currentHour.toString().padStart(2, "0")}:${currentMinute
        .toString()
        .padStart(2, "0")} - ${sessionEndTime
        .getHours()
        .toString()
        .padStart(2, "0")}:${sessionEndTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );

    // Advance time based on iteration interval, handling hour rollover
    const nextTime = new Date(
      1970,
      0,
      1,
      currentHour,
      currentMinute + sessionDuration,
      0
    );
    currentHour = nextTime.getHours();
    currentMinute = nextTime.getMinutes();

    // Print pause time slot if it's not the last session
    if (sessionEndTime < new Date(1970, 0, 1, endHour, endMinute, 0)) {
      const pauseStartTime = new Date(
        1970,
        0,
        1,
        currentHour,
        currentMinute,
        0
      );
      const pauseEndTime = new Date(
        1970,
        0,
        1,
        currentHour,
        currentMinute + pauseDuration,
        0
      );

      console.log(
        `Pause from ${pauseStartTime
          .getHours()
          .toString()
          .padStart(2, "0")}:${pauseStartTime
          .getMinutes()
          .toString()
          .padStart(2, "0")} to ${pauseEndTime
          .getHours()
          .toString()
          .padStart(2, "0")}:${pauseEndTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );

      currentHour = pauseEndTime.getHours();
      currentMinute = pauseEndTime.getMinutes();
    }
  }

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    // Calculate session end time considering potential hour rollover
    const sessionEndTime = new Date(
      1970,
      0,
      1,
      currentHour,
      currentMinute + sessionDuration,
      0
    );

    // Format and print session time slot
    console.log(
      `${currentHour.toString().padStart(2, "0")}:${currentMinute
        .toString()
        .padStart(2, "0")} - ${sessionEndTime
        .getHours()
        .toString()
        .padStart(2, "0")}:${sessionEndTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );

    // Advance time based on iteration interval, handling hour rollover
    const nextTime = new Date(
      1970,
      0,
      1,
      currentHour,
      currentMinute + sessionDuration,
      0
    );
    currentHour = nextTime.getHours();
    currentMinute = nextTime.getMinutes();

    // Print pause time slot if it's not the last session
    if (sessionEndTime < new Date(1970, 0, 1, endHour, endMinute, 0)) {
      const pauseStartTime = new Date(
        1970,
        0,
        1,
        currentHour,
        currentMinute,
        0
      );
      const pauseEndTime = new Date(
        1970,
        0,
        1,
        currentHour,
        currentMinute + pauseDuration,
        0
      );

      console.log(
        `Pause from ${pauseStartTime
          .getHours()
          .toString()
          .padStart(2, "0")}:${pauseStartTime
          .getMinutes()
          .toString()
          .padStart(2, "0")} to ${pauseEndTime
          .getHours()
          .toString()
          .padStart(2, "0")}:${pauseEndTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );

      currentHour = pauseEndTime.getHours();
      currentMinute = pauseEndTime.getMinutes();
    }
  }
}

// Combined usage:
loopWeekdays(
  "Monday",
  "Friday",
  "Wednesday",
  false,
  true,
  (day, isFirstDay, sessions) => {
    console.log(`-- ${day} --`);
    if (day === "Wednesday") {
      if (sessions[0]) {
        console.log(`-- Morning session --`);
        iterateTimeSlots("09:00", "12:15", 90, 15, isFirstDay);
      } else if (sessions[1]) {
        console.log(`-- Afternoon session --`);
        iterateTimeSlots("13:30", "16:45", 90, 15, isFirstDay);
      }
    } else {
      console.log(`-- Morning session --`);
      iterateTimeSlots("09:00", "12:15", 90, 15, isFirstDay);
      console.log(`-- Afternoon session --`);
      iterateTimeSlots("13:30", "16:45", 90, 15, isFirstDay);
    }
  }
);

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

// Example usage:
const period = ["13:30", "15:00"];
const startTime = "";
const endTime = "";
const intersections = isIntersected(period, startTime, endTime);
console.log("Periods intersected:", intersections);
