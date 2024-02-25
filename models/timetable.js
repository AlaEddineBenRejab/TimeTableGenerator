const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeTableSchema = new Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 30 },
  description: { type: String },
  days: {},
  user: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  timeTableSettings: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "timetablesettings",
  },
  sessions: [{ type: mongoose.Types.ObjectId, ref: "Session" }],
});

module.exports = mongoose.model("TimeTable", timeTableSchema, "TimeTable", {
  strict: false,
});
