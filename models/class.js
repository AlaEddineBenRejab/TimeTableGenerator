const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  capacity: { type: Number, required: true },
  avaibility: [{ type: mongoose.Types.ObjectId, ref: "Session" }],
  profs: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  subjectTypes: [
    {
      subjectType: {
        type: mongoose.Types.ObjectId,
        ref: "SubjectType",
      },
    },
  ],
});

module.exports = mongoose.model("Class", ClassSchema, "Class", {
  strict: false,
});
