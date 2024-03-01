const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true }, //username should be unique for each user
  gender: { type: String, required: true, enum: ["male", "female"] },
  birthday: { type: Date },
  email: { type: String, required: true, unique: true }, //email should be unique for each user
  phoneNumber: { type: String, required: true, unique: true },
  imageUrl: { type: String },
  password: { type: String, required: true, minlength: 6 },
  subjects: [{ type: mongoose.Types.ObjectId, ref: "Subject" }],
  subjectTypes: [
    {
      subjectType: {
        type: mongoose.Types.ObjectId,
        ref: "SubjectType",
        unique: true,
      },
      timeTeaching: Number,
    },
  ],
  hourlyVolume: { type: Number },
  avaibility: [{ type: mongoose.Types.ObjectId, ref: "Session" }],
  classes: [{ type: mongoose.Types.ObjectId, ref: "Class", unique: true }],
});

module.exports = mongoose.model("User", userSchema, "User", { strict: false });
