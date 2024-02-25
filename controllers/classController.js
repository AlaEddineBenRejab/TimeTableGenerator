const Class = require("../models/class");
const Subject = require("../models/subject");

const addClass = async (req, res) => {
  const { name, capacity } = req.body;
  const classObj = new Class({ name, capacity });
  try {
    await classObj.save();
    res.status(201).json(classObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const addSubjects = async (req, res) => {
  const { name, subject, subjectType } = req.body;

  try {
    const classe = await Class.findOne({ name: name });
    const subjectDoc = await Subject.findOne({ name: subject }).populate({
      path: "subjectType",
      match: { type: subjectType }, // Match the SubjectType by type
    });
    if (!classe) {
      return res.status(404).json({ message: "Classe not found" });
    }
    if (!subjectDoc) {
      return res.status(400).json({ message: "Subject does not exist" });
    }

    if (!subjectDoc.subjectType || subjectDoc.subjectType.length === 0) {
      return res.status(400).json({ message: "Subject type does not exist" });
    }
    classe.subjectTypes.push({
      subjectType: subjectDoc.subjectType[0]._id, // Assuming you want to save only one subjectType
    });
    await classe.save();
    console.log(classe.subjectTypes);
    return res.status(201).send(classe.subjectTypes);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    //console.log(classes)
    res.json(classes);
  } catch (err) {
    res.status(500).send("Error occured");
  }
};
module.exports = { addClass, getAllClasses, addSubjects };
