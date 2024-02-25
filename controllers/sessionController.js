const Session = require("../models/session");
const classroom = require("../models/classroom");
const prof = require("../models/UserModel");
const subjectType = require("../models/subjectType");
const Classe = require("../models/class");
const timeTableSettings = require("../models/timeTableSettings");
const {
  isIntersected,
  loopWeekdays,
  iterateTimeSlots,
} = require("../utils/utilsTableGenerator");

const generateSessionsAutomatically = async (req, res) => {
  const { timeTableName } = req.body;
  // Get all available professors
  const professors = await prof.find();
  // Get all available classrooms
  const classrooms = await classroom.find();
  // Get all available classes
  const classes = await Classe.find();
  // Get all available subject types
  const subjectTypes = await subjectType.find();
  const timeTableSetting = await timeTableSettings.findOne({
    name: timeTableName,
  });
  if (!timeTableSetting) {
    return res
      .status(400)
      .json({ message: "Time table settings does not exist" });
  }

  let schedule; // Declare schedule here

  try {
    if (timeTableSetting.selectedDaySession == "Morning") {
      schedule = loopWeekdays(
        timeTableSetting.startDay,
        timeTableSetting.endDay,
        timeTableSetting.selectedDay,
        true,
        false,
        (day, isFirstDay, sessions, addPeriod) => {
          if (day === timeTableSetting.selectedDay) {
            if (sessions[0]) {
              iterateTimeSlots(
                timeTableSetting.morningStart,
                timeTableSetting.morningEnd,
                timeTableSetting.sessionTime,
                timeTableSetting.pause
              ).forEach((period) => {
                addPeriod(period);
              });
            } else if (sessions[1]) {
              iterateTimeSlots(
                timeTableSetting.afternoonStart,
                timeTableSetting.afternoonEnd,
                timeTableSetting.sessionTime,
                timeTableSetting.pause
              ).forEach((period) => {
                addPeriod(period);
              });
            }
          } else {
            iterateTimeSlots(
              timeTableSetting.morningStart,
              timeTableSetting.morningEnd,
              timeTableSetting.sessionTime,
              timeTableSetting.pause
            ).forEach((period) => {
              addPeriod(period);
            });
            iterateTimeSlots(
              timeTableSetting.afternoonStart,
              timeTableSetting.afternoonEnd,
              timeTableSetting.sessionTime,
              timeTableSetting.pause
            ).forEach((period) => {
              addPeriod(period);
            });
          }
        }
      );
    } else {
      schedule = loopWeekdays(
        timeTableSetting.startDay,
        timeTableSetting.endDay,
        timeTableSetting.selectedDay,
        false,
        true,
        (day, isFirstDay, sessions, addPeriod) => {
          if (day === timeTableSetting.selectedDay) {
            if (sessions[0]) {
              iterateTimeSlots(
                timeTableSetting.morningStart,
                timeTableSetting.morningEnd,
                timeTableSetting.sessionTime,
                timeTableSetting.pause
              ).forEach((period) => {
                addPeriod(period);
              });
            } else if (sessions[1]) {
              iterateTimeSlots(
                timeTableSetting.afternoonStart,
                timeTableSetting.afternoonEnd,
                timeTableSetting.sessionTime,
                timeTableSetting.pause
              ).forEach((period) => {
                addPeriod(period);
              });
            }
          } else {
            iterateTimeSlots(
              timeTableSetting.morningStart,
              timeTableSetting.morningEnd,
              timeTableSetting.sessionTime,
              timeTableSetting.pause
            ).forEach((period) => {
              addPeriod(period);
            });
            iterateTimeSlots(
              timeTableSetting.afternoonStart,
              timeTableSetting.afternoonEnd,
              timeTableSetting.sessionTime,
              timeTableSetting.pause
            ).forEach((period) => {
              addPeriod(day, period);
            });
          }
        }
      );
    }
    //res.status(200).send(schedule);
    for (const day in schedule) {
      const periods = schedule[day];
      periods.forEach(async (period) => {
        console.log(period);
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { generateSessionsAutomatically };
