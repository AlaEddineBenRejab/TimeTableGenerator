const express = require("express");
const router = express.Router();

const {
  addTimeTableSettings,
  getAllTimeTablesSettings,
} = require("../controllers/timeTableSettingsController");

router.post("/addTimeTableSettings", addTimeTableSettings);
router.get("/getAllTimeTablesSettings", getAllTimeTablesSettings);

module.exports = router;
