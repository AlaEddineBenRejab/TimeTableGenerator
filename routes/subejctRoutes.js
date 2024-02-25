const express = require("express");

const router = express.Router();
const {
  addSubject,
  getAllSubejcts,
} = require("../controllers/subjectController");

router.post("/addSubject", addSubject);
router.get("/getSubjects", getAllSubejcts);

module.exports = router;
