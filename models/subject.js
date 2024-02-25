const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: { type: String, required: true, unique: true },
  subjectType: [
    { type: mongoose.Types.ObjectId, ref: "SubjectType", required: true },
  ],
});

subjectSchema.virtual("hasSubjectType", {
  ref: "SubjectType",
  localField: "subjectType",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Subject", subjectSchema, "Subject", {
  strict: false,
});
