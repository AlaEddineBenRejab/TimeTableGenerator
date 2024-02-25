const TimeTable=require("../models/timetable");
const Classroom=require("../models/classroom");
const Classes=require('../models/class');


//  Function to check if the classroom is available for the period time specified...
const checkClassroomAvaibility= async function(classroomName,periodTime){
    const classroom = await Classroom.findOne( {name: classroomName});  //find classroom by name
    if(!classroom){
        return false;                                              //if no such classroom, return false
    }
    else{
        for(let i=0; i<classroom.TimeLine.length; i++){
            if(isIntersected(classroom.TimeLine[i], periodTime)=true){   //checking each timeline of the classroom with the given period time
                return false;                                           //if classroom is occupied this timemline so it's not available
            }
            else return true;        // if the cassroom is not occupied this timemline so it's available
        } 
    }
}

//  Function to check if the class is available for the period time specified...
const checkClassAvailability = async function(className, periodTime) {
    const classes = await Classes.findOne({ name: className });  //find class by name
    if (!classes) {
        return false;  //if no such classroom, return false
    } else {
        for (let i = 0; i < classes.TimeLine.length; i++) {
            if (isIntersected(classes.TimeLine[i], periodTime) === true) { //checking each timeline of the classroom with the given period time
                return false; //if classroom is occupied this timeline so it's not available
            } else {
                return true; // if the classroom is not occupied this timeline so it's available
            }
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


// Function to check if the two periods are cross each other
function isIntersected(period1, period2) {
    const [start1, end1] = period1;  // decompose the period into [start1,end1]
    const [start2, end2] = period2;     
    return Math.max(start1, start2) < Math.min(end1, end2);  // return true if the periods croos each other
}


module.exports = {};


loopWeekdays(
    "Monday",
    "Friday",
    "Wednesday",
    true,
    false,
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
  