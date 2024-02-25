const express = require("express");
const router = express.Router();
const {
  AddSubjectToProf,
  addClasstoProf,
} = require("../controllers/profController");

router.post("/AddSubjectToProf", AddSubjectToProf);
router.post("/AddClasstoProf", addClasstoProf);

module.exports = router;
