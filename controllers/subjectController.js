const Subject = require("../models/subject");
const SubjectType = require("../models/subjectType");

const addSubject = async (req, res) => {
  const {
    subjectName,
    hourlyVolume,
    classroomTypes,
    subjectTypeReq,
    sessionTime,
  } = req.body;

  console.log(subjectName, hourlyVolume, subjectTypeReq, sessionTime);

  try {
    const subject = await Subject.findOne({ name: subjectName });
    console.log(subject);
    if (subject) {
      let newSubjectType = new SubjectType({
        type: subjectTypeReq, // Assuming subjectType is the name of the SubjectType
        hourlyVolume: hourlyVolume, // Assuming hourlyVolume is provided in the request body
        sessionTime: sessionTime, // Assuming sessionTime is provided in the request body
        classroomTypes: classroomTypes, // Assuming sessionTime is provided in the request body
      });
      console.log(newSubjectType);
      await newSubjectType.save();
      // Find the SubjectType and push the ID of the new Subject into its subjects array
      const updatedSubjectType = await SubjectType.findByIdAndUpdate(
        newSubjectType._id,
        { $push: { subject: subject._id } },
        { new: true }
      );
      const updatedSubject = await Subject.findByIdAndUpdate(
        subject._id,
        { $push: { subjectType: newSubjectType._id } },
        { new: true }
      );
      res.status(200).json({ updatedSubject, updatedSubjectType });
    } else {
      // Create a new SubjectType
      let newSubjectType = new SubjectType({
        type: subjectTypeReq, // Assuming subjectType is the name of the SubjectType
        hourlyVolume: hourlyVolume, // Assuming hourlyVolume is provided in the request body
        sessionTime: sessionTime, // Assuming sessionTime is provided in the request body
        classroomTypes: classroomTypes, // Assuming classrommTypes is provided in the request body
      });
      // Save the new SubjectType
      await newSubjectType.save();

      // Create a new Subject with reference to the newly created SubjectType
      let newSubject = new Subject({
        name: subjectName,
        subjectType: newSubjectType._id, // Assign the ObjectId of the new SubjectType
      });
      console.log(newSubject);

      // Save the new Subject
      await newSubject.save();
      // Find the SubjectType and push the ID of the new Subject into its subjects array
      const updatedSubjectType = await SubjectType.findByIdAndUpdate(
        newSubjectType._id,
        { $push: { subject: newSubject._id } },
        { new: true }
      );

      res.status(200).json({ newSubject, updatedSubjectType });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add subject to SubjectType" });
  }
};

const getAllSubejcts = async (req, res) => {
  try {
    subjects = await Subject.find();
    // console.log(classes);
    res.status(200).json(subjects);
  } catch (e) {
    res.status(404).json("Error");
  }
};

module.exports = { addSubject, getAllSubejcts };
