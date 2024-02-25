const TimeTableSettings = require("../models/timeTableSettings");

const addTimeTableSettings = async function (req, res) {
  const {
    name,
    startDay,
    endDay,
    morningStart,
    morningEnd,
    afternoonStart,
    afternoonEnd,
    sessionTime,
    pause,
    selectedDay,
    selectedDaySession,
  } = req.body;

  try {
    let TimeTable = await TimeTableSettings.create({
      name: name,
      startDay: startDay,
      endDay: endDay,
      morningStart: morningStart,
      morningEnd: morningEnd,
      afternoonStart: afternoonStart,
      afternoonEnd: afternoonEnd,
      sessionTime: sessionTime,
      pause: pause,
      selectedDay: selectedDay,
      selectedDaySession: selectedDaySession,
    });
    res.status(201).json(TimeTable); //Created
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error creating the time table settings" });
  }
};

const getAllTimeTablesSettings = (req, res) => {
  TimeTableSettings.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error getting the time tables settings" });
    });
};

module.exports = { addTimeTableSettings, getAllTimeTablesSettings };
