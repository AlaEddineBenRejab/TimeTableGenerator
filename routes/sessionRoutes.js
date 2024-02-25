const express = require("express");
const router = express.Router();

const {
  generateSessionsAutomatically,
} = require("../controllers/sessionController");

router.post("/generateAutomaticTimeTable", generateSessionsAutomatically);

module.exports = router;
