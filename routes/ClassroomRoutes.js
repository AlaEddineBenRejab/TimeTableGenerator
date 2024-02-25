const express = require("express");
const router = express.Router();
const {
  addClassroom,
  getAllClasses,
} = require("../controllers/classroomController");

router.post("/addClassroom", addClassroom); //add a classroom to the database
router.get("/getAllClasses", getAllClasses); //return all classrooms in the database</s>

module.exports = router;
