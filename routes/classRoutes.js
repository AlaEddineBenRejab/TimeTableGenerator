const express = require("express");

const router = express.Router();
const {
  addClass,
  getAllClasses,
  addSubjects,
} = require("../controllers/classController");

router.post("/addClass", addClass);
router.post("/addSubjectsToClass", addSubjects);
// get all classes
router.get("/", getAllClasses);
module.exports = router;
