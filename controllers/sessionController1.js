const Session = require("../models/session");
const Classroom = require("../models/classroom");
const prof = require("../models/UserModel");
const timeTableSettings = require("../models/timeTableSettings");
const subjectType = require("../models/subjectType");
const Classes = require("../models/class");

const { loopWeekdays } = require("../utils/LoopWeekDays");
const { isIntersected } = require("../utils/utilsTableGenerator");

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
  if (timeTableSetting.selectedDaySession == "Morning") {
    firstSession = true;
    secondSession = false;
  } else {
    firstSession = false;
    secondSession = true;
  }

  const dayOffs = ["2024-09-18", "2024-09-25"];
  const callbackFunction = async (day, date, slot) => {
    try {
      const randomIndex = Math.floor(Math.random() * classes.length);
      const randomClass = classes[randomIndex];
      const randomSubject =
        subjectTypes[Math.floor(Math.random() * subjectTypes.length)];
      const subjectTypeId = randomSubject.subjectType; // Extract the subjectType ObjectId
      const isIncluded = randomClass.subjectTypes.some((item) =>
        item.subjectType.equals(subjectTypeId)
      );

      if (isIncluded) {
        const subjectTypeObj = await subjectType
          .findById(subjectTypeId)
          .populate("subject"); // Populate the subject field
        const classrooms = await Classroom.find({
          type: subjectTypeObj.classroomTypes,
        }).populate({ path: "avaibility" });

        const classroom =
          classrooms[Math.floor(Math.random() * classrooms.length)];
        if (
          !isIntersected(
            slot,
            classroom.avaibility.startTime,
            classroom.avaibility.endTime
          )
        ) {
          const sessionDuration = slot[1] - slot[0];
          if (subjectTypeObj.sessionTime === 2 * timeTableSetting.sessionTime) {
            // If subject duration is double the session time, generate two consecutive sessions with the same subject
            let sessionStartTime;
            if (firstSession) {
              sessionStartTime = timeTableSetting.morningStart; // Morning session start time
            } else {
              sessionStartTime = timeTableSetting.afternoonStart; // Afternoon session start time
            }

            const newSession1 = new Session({
              sessionName: `${professor.firstName} ${randomClass.name} ${subjectTypeObj.subject.name}`, // Use subject name
              date: date,
              day: day,
              classroom: classroom._id,
              class: randomClass._id,
              subjectType: subjectTypeId,
              startTime: sessionStartTime,
              endTime: sessionStartTime + 3 * 60 * 1000, // 180 minutes in milliseconds
            });
            await newSession1.save();
            console.log(`New session saved: ${newSession1}`);

            const newSession2 = new Session({
              sessionName: `${professor.firstName} ${randomClass.name} ${subjectTypeObj.subject.name} ${subjectTypeObj.type}`, // Use subject name
              date: date,
              day: day,
              classroom: classroom._id,
              class: randomClass._id,
              subjectType: subjectTypeId,
              startTime: sessionStartTime + 3 * 60 * 1000, // Start time of second session
              endTime: sessionStartTime + 2 * 3 * 60 * 1000, // End time of second session
            });
            await newSession2.save();
            console.log(`New session saved: ${newSession2}`);
          } else {
            // Otherwise, create a session with the randomly selected subject
            const newSession = new Session({
              sessionName: `${professor.firstName} ${randomClass.name} ${subjectTypeObj.subject.name} ${subjectTypeObj.type}`, // Use subject name
              date: date,
              day: day,
              classroom: classroom._id,
              class: randomClass._id,
              subjectType: subjectTypeId,
              startTime: slot[0],
              endTime: slot[1],
            });

            await newSession.save();
            console.log(`New session saved: ${newSession}`);
          }
        }
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  loopWeekdays(
    timeTableSetting.startDate,
    timeTableSetting.endDate,
    timeTableSetting.startDay,
    timeTableSetting.endDay,
    timeTableSetting.selectedDay,
    firstSession,
    secondSession,
    dayOffs,
    callbackFunction,
    timeTableSetting.morningStart,
    timeTableSetting.morningEnd,
    timeTableSetting.afternoonStart,
    timeTableSetting.afternoonEnd,
    timeTableSetting.sessionTime,
    timeTableSetting.pause
  );
  res.status(200);
};

const generateTimeTableManually = async (req, res) => {
  const {
    sessionName,
    date,
    day,
    startTime,
    endTime,
    timetable,
    salle,
    profe,
    classe,
    subjectType,
  } = req.body;

  try {
    // Find the classroom by ID and populate its sessions
    const classroom = await Classroom.findById(salle).populate("avaibility");

    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found." });
    }

    // Check if there's a conflicting session in the classroom
    const classroomConflictingSession = classroom.avaibility.find((session) => {
      return (
        session.date === date &&
        session.day === day &&
        ((session.startTime >= startTime && session.startTime < endTime) ||
          (session.endTime > startTime && session.endTime <= endTime) ||
          (session.startTime <= startTime && session.endTime >= endTime))
      );
    });

    if (classroomConflictingSession) {
      return res.status(400).json({
        error: "Conflicting session already exists in the classroom.",
      });
    }

    const pofessor = await prof.findById(profe).populate("avaibility");

    if (!pofessor) {
      return res.status(404).json({ error: "Classroom not found." });
    }

    // Check if there's a conflicting session in the professor
    const profConflictingSession = pofessor.avaibility.find((session) => {
      return (
        session.date === date &&
        session.day === day &&
        ((session.startTime >= startTime && session.startTime < endTime) ||
          (session.endTime > startTime && session.endTime <= endTime) ||
          (session.startTime <= startTime && session.endTime >= endTime))
      );
    });

    if (profConflictingSession) {
      return res.status(400).json({
        error: "Conflicting session already exists in the classroom.",
      });
    }

    const Classe = await classes.findById(classe).populate("avaibility");

    if (!Classe) {
      return res.status(404).json({ error: "Classroom not found." });
    }

    // Check if there's a conflicting session in the professor
    const classeConflictingSession = Classe.avaibility.find((session) => {
      return (
        session.date === date &&
        session.day === day &&
        ((session.startTime >= startTime && session.startTime < endTime) ||
          (session.endTime > startTime && session.endTime <= endTime) ||
          (session.startTime <= startTime && session.endTime >= endTime))
      );
    });

    if (classeConflictingSession) {
      return res.status(400).json({
        error: "Conflicting session already exists in the classroom.",
      });
    }

    // Further logic...
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate timetable manually." });
  }
};

module.exports = {
  generateSessionsAutomatically,
};
