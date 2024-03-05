const Session = require("../models/session");
const Classroom = require("../models/classroom");
const prof = require("../models/UserModel");
const timeTableSettings = require("../models/timeTableSettings");
const subjectType = require("../models/subjectType");
const {
  isIntersected,
  loopWeekdays,
  iterateTimeSlots,
  timeToMinutesTimeTable,
} = require("../utils/utilsTableGenerator");
const SubjectType = require("../models/subjectType");

const generateSessionsAutomatically = async (req, res) => {
  const { timeTableName, username } = req.body;
  // Get all available professors
  const professor = await prof.findOne({ username: username }).populate({
    path: "classes",
    populate: { path: "avaibility" }, // Populate the 'avaibility' field inside 'classes'
  });
  const classes = professor.classes;
  const subjectTypes = professor.subjectTypes;
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
      for (let i = 0; i < periods.length; i++) {
        const period = periods[i];
        const nextPeriod = periods[i + 1]; // Get the next period, if it exists
        const randomIndex = Math.floor(Math.random() * classes.length);
        const randomClass = classes[randomIndex];
        if (
          !isIntersected(
            period,
            randomClass.avaibility.startTime,
            randomClass.avaibility.endTime
          )
        ) {
          const randomSubject =
            subjectTypes[Math.floor(Math.random() * subjectTypes.length)];
          const subjectTypeId = randomSubject.subjectType; // Extract the subjectType ObjectId
          const isIncluded = randomClass.subjectTypes.some((item) =>
            item.subjectType.equals(subjectTypeId)
          );
          if (isIncluded) {
            const subjecttype = await subjectType.findById(subjectTypeId);
            const classrooms = await Classroom.find({
              type: subjecttype.classroomTypes,
            }).populate({
              path: "avaibility", // Field to populate
            });

            const classroom =
              classrooms[Math.floor(Math.random() * classrooms.length)];
            if (
              !isIntersected(
                period,
                classroom.avaibility.startTime,
                classroom.avaibility.endTime
              )
            )
              if (
                nextPeriod &&
                subjecttype.sessionTime ===
                  timeToMinutesTimeTable(nextPeriod[1]) -
                    timeToMinutesTimeTable(nextPeriod[0]) +
                    timeToMinutesTimeTable(period[1]) -
                    timeToMinutesTimeTable(period[0])
              ) {
                // If session time is double the duration of the period,
                // create a single session spanning both periods
                const seance = new Session({
                  sessionName:
                    professor.firstName +
                    " " +
                    randomClass.name +
                    " " +
                    subjecttype.type,
                  classroom: classroom._id,
                  class: randomClass._id,
                  subjectType: subjectTypeId,
                  startTime: period[0],
                  endTime: nextPeriod[1],
                });
                await seance.save();
                console.log(seance);
                // Increment i to skip the next period in the loop
                i++;
              } else {
                const seance = new Session({
                  sessionName:
                    professor.firstName +
                    " " +
                    randomClass.name +
                    " " +
                    subjecttype.type,
                  classroom: classroom._id,
                  class: randomClass._id,
                  subjectType: subjectTypeId,
                  startTime: period[0],
                  endTime: period[1],
                });
                await seance.save();
                console.log(day + seance);
              }
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { generateSessionsAutomatically };
