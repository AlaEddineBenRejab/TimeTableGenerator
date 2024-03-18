const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sessionName: { type: String, require: true },
  date: { type: String, require: true },
  startTime: { type: String, require: true },
  endTime: { type: String, require: true },
  timetable: { type: mongoose.Types.ObjectId, ref: "TimeTable" },
  classroom: { type: mongoose.Types.ObjectId, ref: "Classroom" },
  prof: { type: mongoose.Types.ObjectId, ref: "User" },
  class: { type: mongoose.Types.ObjectId, ref: "Class" },
  subjectType: { type: mongoose.Types.ObjectId, ref: "SubjectType" },
});

module.exports = mongoose.model("Session", sessionSchema, "Session", {
  strict: false,
});
