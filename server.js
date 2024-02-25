const express = require("express");
const http = require("http"); // Add this line to import http module
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
require("dotenv").config();

const userRoutes = require("./routes/authRoutes");
const classroomRoutes = require("./routes/ClassroomRoutes");
const classRoutes = require("./routes/classRoutes");
const periodRoutes = require("./routes/periodRoutes");
const timeTableSettingsRoutes = require("./routes/timeTableSettings");
const subjectRoutes = require("./routes/subejctRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const profRoutes = require("./routes/profRoutes");

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  bodyParser.json()(req, res, (error) => {
    if (error) {
      console.log(error.message);
      return res.status(400).json({ message: error["message"] });
    }
    next();
  });
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  next();
});

//Routes declaration
app.use(userRoutes); //-----------------------------------------------------------------------USER ROUTES
app.use(classroomRoutes); //------------------------------------------------------------------CLASSROOM ROUTES
app.use(classRoutes); //----------------------------------------------------------------------CLASS ROUTES
app.use(periodRoutes); //---------------------------------------------------------------------PERIOD ROUTES
app.use(timeTableSettingsRoutes); //----------------------------------------------------------TIME TABLE SETTINGS ROUTES
app.use(subjectRoutes); //--------------------------------------------------------------------SUBJECTS ROUTES
app.use(sessionRoutes); //--------------------------------------------------------------------SESSIONS ROUTES
app.use(profRoutes); //-----------------------------------------------------------------------PROF ROUTES

const httpServer = http.createServer(app); // Fix createServer

mongoose
  .connect(process.env.DATA_BASE_URL)
  .then(() => {
    console.log("connection with database success...");
    app.listen(PORT, () =>
      console.log(`the application is running at port ${PORT}`)
    );
  })
  .catch((error) => {
    console.log(error["message"]);
  });

exports.httpServer = httpServer;
