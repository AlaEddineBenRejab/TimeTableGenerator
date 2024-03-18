const { iterateTimeSlots } = require("../utils/utilsTableGenerator");
const Session = require("../models/session");

function loopWeekdays(
  startDate,
  endDate,
  startWeekDay,
  endWeekDay,
  selectedDay,
  firstSession,
  secondSession,
  dayOffs,
  callback,
  firstSessionStartTime,
  firstSessionEndTime,
  secondSessionStartTime,
  secondSessionEndTime,
  sessionDuration,
  slotDuration
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

      // If it's the selected day, use the appropriate session based on firstSession and secondSession flags
      if (isRemarkable && firstSession) {
        iterateTimeSlots(
          firstSessionStartTime,
          firstSessionEndTime,
          sessionDuration,
          slotDuration
        )
          .slice(0, 2)
          .forEach((slot) => {
            callback(dayOfWeek, currentDateStr, slot);
          });
      } else if (isRemarkable && secondSession) {
        iterateTimeSlots(
          secondSessionStartTime,
          secondSessionEndTime,
          sessionDuration,
          slotDuration
        )
          .slice(0, 2)
          .forEach((slot) => {
            callback(dayOfWeek, currentDateStr, slot);
          });
      } else {
        iterateTimeSlots(
          firstSessionStartTime,
          firstSessionEndTime,
          sessionDuration,
          slotDuration
        ).forEach((slot) => {
          callback(dayOfWeek, currentDateStr, slot);
        });
        iterateTimeSlots(
          secondSessionStartTime,
          secondSessionEndTime,
          sessionDuration,
          slotDuration
        ).forEach((slot) => {
          callback(dayOfWeek, currentDateStr, slot);
        });
      }

      selectedDays.push({
        day: dayOfWeek,
        date: currentDateStr,
        remarkable: isRemarkable,
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return selectedDays;
}

// Define a callback function to use with loopWeekdays
const callbackFunction = (day, date, slot) => {
  console.log(`${day} ${date}:\n${JSON.stringify(slot, null, 2)}`);
};

// Define the array of days to skip (dayOffs)
const dayOffs = ["2024-09-18", "2024-09-25"]; // Example array of dates to skip

// Call loopWeekdays with example parameters, including the selected day
const startDate = "2024-09-15"; // Start date of the range
const endDate = "2024-10-30"; // End date of the range
const startWeekDay = "Monday"; // Start weekday of the week
const endWeekDay = "Friday"; // End weekday of the week
const selectedDay = "Wednesday"; // Selected remarkable day
const firstSession = true; // Example of first session parameter
const secondSession = false; // Example of second session parameter

// Define session timings and durations as variables
const firstSessionStartTime = "09:00";
const firstSessionEndTime = "12:30";
const secondSessionStartTime = "13:30";
const secondSessionEndTime = "16:45";
const sessionDuration = 90;
const slotDuration = 15;

loopWeekdays(
  startDate,
  endDate,
  startWeekDay,
  endWeekDay,
  selectedDay,
  firstSession,
  secondSession,
  dayOffs,
  callbackFunction,
  firstSessionStartTime,
  firstSessionEndTime,
  secondSessionStartTime,
  secondSessionEndTime,
  sessionDuration,
  slotDuration
);
