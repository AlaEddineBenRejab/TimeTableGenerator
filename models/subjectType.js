const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectTypeSchema = new Schema({
  type: {
    type: String,
    enum: ["Amphie", "TP", "IT", "Cours"],
    required: true,
  },
  hourlyVolume: { type: Number, required: true },
  sessionTime: { type: String, required: true },
  preferedDay: { type: String },
  classroomTypes: {
    type: String,
    enum: ["Amphie", "TP", "IT", "Cours", "labo"],
    required: true,
  }, //TODO : ajouter une référence vers la salle de ce type (cf labo)
  docs: { type: String },
  subject: { type: mongoose.Types.ObjectId, ref: "Subject" },
  profs: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  avaibility: [{ type: mongoose.Types.ObjectId, ref: "Session" }],
});

module.exports = mongoose.model(
  "SubjectType",
  subjectTypeSchema,
  "SubjectType",
  {
    strict: false,
  }
);
