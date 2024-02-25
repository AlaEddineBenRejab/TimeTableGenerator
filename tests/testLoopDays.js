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

      /*console.log(
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
      );*/

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

      /*console.log(
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
      );*/

      currentHour = pauseEndTime.getHours();
      currentMinute = pauseEndTime.getMinutes();
    }
  }
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
    callback(day, index === 0, sessions, (startTime, endTime) => {
      periods.push(`${startTime} - ${endTime}`);
    });
    result[day] = periods;
  });

  return result;
}

// Adjusted callback function to generate periods using iterateTimeSlots
const schedule = loopWeekdays(
  "Monday",
  "Friday",
  "Wednesday",
  true,
  false,
  (day, isFirstDay, sessions, addPeriod) => {
    if (day === "Wednesday") {
      if (sessions[0]) {
        iterateTimeSlots(
          "09:00",
          "12:15",
          90,
          15,
          isFirstDay,
          (startTime, endTime) => {
            addPeriod(startTime, endTime);
          }
        );
      } else if (sessions[1]) {
        iterateTimeSlots(
          "13:30",
          "16:45",
          90,
          15,
          isFirstDay,
          (startTime, endTime) => {
            addPeriod(startTime, endTime);
          }
        );
      }
    } else {
      iterateTimeSlots(
        "09:00",
        "12:15",
        90,
        15,
        isFirstDay,
        (startTime, endTime) => {
          addPeriod(startTime, endTime);
        }
      );
      iterateTimeSlots(
        "13:30",
        "16:45",
        90,
        15,
        isFirstDay,
        (startTime, endTime) => {
          addPeriod(startTime, endTime);
        }
      );
    }
  }
);

console.log(schedule);
