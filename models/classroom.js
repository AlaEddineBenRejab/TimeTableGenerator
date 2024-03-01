const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Classroom = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: { type: Number },
  type: {
    type: String,
    enum: ["Amphie", "TP", "IT", "Cours", "labo"],
    required: true,
  },
  avaibility: [{ type: mongoose.Types.ObjectId, ref: "Session" }],
});

module.exports = mongoose.model("Classroom", Classroom, "Classroom", {
  strict: false,
});
