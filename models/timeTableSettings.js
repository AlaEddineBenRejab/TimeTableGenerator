const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeTableSettingsSchema = new Schema({
  name: { type: String, unique: true, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startDay: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  endDay: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  morningStart: { type: String, required: true },
  morningEnd: { type: String, required: true },
  afternoonStart: { type: String, required: true },
  afternoonEnd: { type: String, required: true },
  sessionTime: { type: Number, required: true },
  pause: { type: Number, required: true },
  selectedDay: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  selectedDaySession: { type: String, enum: ["Morning", "Afternoon"] },
});

module.exports = mongoose.model(
  "timetablesettings",
  timeTableSettingsSchema,
  "timetablesettings",
  {
    strict: false,
  }
);
