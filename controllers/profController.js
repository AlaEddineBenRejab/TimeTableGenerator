const User = require("../models/UserModel");
const Subject = require("../models/subject");
const Class = require("../models/class");

const AddSubjectToProf = async (req, res) => {
  const { username, subject, subjectType, timeTeaching } = req.body;
  try {
    // Await the result of the User.findOne() query
    const prof = await User.findOne({ username: username });
    if (!prof) {
      return res.status(400).json({ message: "Professor does not exist" });
    }

    // Populate the subjectType field in the Subject document
    const subjectDoc = await Subject.findOne({ name: subject }).populate({
      path: "subjectType",
      match: { type: subjectType }, // Match the SubjectType by type
    });

    if (!subjectDoc) {
      return res.status(400).json({ message: "Subject does not exist" });
    }

    if (!subjectDoc.subjectType || subjectDoc.subjectType.length === 0) {
      return res.status(400).json({ message: "Subject type does not exist" });
    }

    // Assuming prof.subjectTypes is an array, push the new subject type with time teaching
    // Save only the ObjectId of the subjectType
    prof.subjectTypes.push({
      subjectType: subjectDoc.subjectType[0]._id, // Assuming you want to save only one subjectType
      timeTeaching,
    });
    await prof.save();
    return res.status(201).send(prof.subjectTypes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addClasstoProf = async (req, res) => {
  const { username, className } = req.body;
  try {
    const prof = await User.findOne({ username: username });
    if (!prof) {
      return res.status(400).json({ message: "Professor does not exist" });
    }
    const classe = await Class.findOne({ name: className });
    if (!classe) {
      return res.status(400).json({ message: "Class does not exist" });
    }

    // Push prof ID to classe.profs array
    classe.profs.push(prof._id);
    await classe.save();
    prof.calsses.push(classe._id);
    await prof.save();
    console.log(classe.profs);
    return res.status(201).json(prof);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  AddSubjectToProf,
  addClasstoProf,
};
