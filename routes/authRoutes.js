const express = require("express");
const router = express.Router(); 
const { register, login } = require('../controllers/userAuth.js');

router.post('/register', register); // Register a new user to the database
router.post('/login', login);      // Log in an existing user

module.exports = router;