const Classroom = require("../models/classroom");

const addClassroom = async (req, res) => {
  const { name, capacity, type } = req.body;

  let newClassroom = new Classroom({
    name: name,
    capacity: capacity,
    type: type,
  });
  await newClassroom
    .save()
    .then((doc) => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch((err) => console.error(err));
};

const getAllClasses = async (req, res) => {
  try {
    classes = await Classroom.find();
    // console.log(classes);
    res.status(200).json(classes);
  } catch (e) {
    res.status(404).json("Error");
  }
};

module.exports = { addClassroom, getAllClasses };
