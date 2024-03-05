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

function addPeriod(period) {
  // Implement the logic to add periods to the schedule
}
function loopWeekdays(
  startDate,
  endDate,
  startWeekDay,
  endWeekDay,
  selectedDay,
  firstSession,
  secondSession,
  dayOffs,
  addPeriod,
  callback
) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Validate startWeekDay, endWeekDay, and selectedDay parameters
  const startIndex = daysOfWeek.indexOf(startWeekDay);
  const endIndex = daysOfWeek.indexOf(endWeekDay);
  const selectedDayIndex = daysOfWeek.indexOf(selectedDay);

  if (startIndex === -1 || endIndex === -1 || selectedDayIndex === -1) {
    console.log("Invalid start, end, or selected week day.");
    return;
  }

  const selectedDays = [];
  let currentDate = new Date(startDate);

  // Find the first occurrence of the startWeekDay
  while (daysOfWeek[currentDate.getDay()] !== startWeekDay) {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Generate an array of dates within the specified range
  while (currentDate <= new Date(endDate)) {
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const currentDateStr = currentDate.toISOString().slice(0, 10); // Format date as YYYY-MM-DD

    // Check if the current date is not in the dayOffs array
    if (
      !dayOffs.includes(currentDateStr) &&
      dayOfWeek !== "Saturday" &&
      dayOfWeek !== "Sunday"
    ) {
      // Check if the current day is the selected day
      const isRemarkable = currentDate.getDay() === selectedDayIndex;
      selectedDays.push({
        day: dayOfWeek,
        date: currentDateStr,
        remarkable: isRemarkable,
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const result = {};
  // Invoke the callback function for each selected day
  selectedDays.forEach((day) => {
    const periods = []; // Initialize periods as an array

    callback(
      day.day,
      day.date,
      day.remarkable,
      firstSession,
      secondSession,
      addPeriod, // Pass addPeriod as an argument to the callback function
      (period) => {
        // Ensure `addPeriod` is accessible and a function
        if (typeof addPeriod === "function") {
          addPeriod(period); // Call addPeriod only if it's a function
          periods.push(period); // Update periods array with the generated period
        } else {
          console.error("addPeriod is not a function. Skipping period update.");
        }
      }
    );
    result[day.day] = periods; // Update the result object with periods array
  });
  const schedule = loopWeekdays(
    "2024-09-15",
    "2024-10-30",
    "Monday",
    "Friday",
    "Wednesday",
    true,
    false,
    ["2024-09-18", "2024-09-25"],
    addPeriod,
    (day, isFirstDay, sessions, addPeriod) => {
      if (day === "Wednesday") {
        if (sessions[0]) {
          iterateTimeSlots("09:00", "12:15", 90, 15).forEach((period) =>
            addPeriod(period)
          ); // Pass each period to addPeriod
        } else if (sessions[1]) {
          iterateTimeSlots("13:30", "16:45", 90, 15).forEach((period) =>
            addPeriod(period)
          ); // Pass each period to addPeriod
        }
      } else {
        iterateTimeSlots("09:00", "12:15", 90, 15).forEach((period) =>
          addPeriod(period)
        ); // Pass each period to addPeriod
        iterateTimeSlots("13:30", "16:45", 90, 15).forEach((period) =>
          addPeriod(period)
        ); // Pass each period to addPeriod
      }
    }
  );
  console.log(schedule);
}
