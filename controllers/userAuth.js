const User = require("../models/UserModel");
const Subject = require("../models/subject");
const SubjectType = require("../models/subjectType");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    gender,
    birthday,
    birthPlace,
    email,
    phoneNumber,
    imageUrl,
    password,
    subjectName,
    subjectType,
  } = req.body;

  let subjectTypeExistance;

  try {
    /*const subjectExitance = await Subject.findOne({ name: subjectName });
    if (subjectExitance) {
      subjectTypeExistance = await SubjectType.findOne({
        type: subjectType,
      });
      if (!subjectTypeExistance) {
        return res.status(400).send("Subject type does not exist");
      }
    } else {
      return res.status(400).send("Subject does not exist");
    }
    */
    const cryptedPassword = await bcrypt.hash(password, 10);
    console.log(cryptedPassword);
    // Check if user with the same email Passwordalready exists
    const oldUser = await User.findOne({ username });
    if (oldUser) {
      return res.status(409).send("User already exists");
    }

    let newUser = new User({
      firstName,
      lastName,
      username,
      gender,
      birthday,
      birthPlace,
      email,
      phoneNumber,
      imageUrl,
      password: cryptedPassword,
    });

    await newUser.save();

    // Push values into newUser.subjects and newUser.subjectTypes arrays
    /*const updatedNewUser = await User.findByIdAndUpdate(
      newUser._id,
      {
        $push: { subjects: subjectExitance._id },
        $push: { subjectTypes: subjectTypeExistance._id },
      },
      { new: true }
    );

    // Find the SubjectType and push the ID of the new Prof into its profs array
    const updatedSubjectType = await SubjectType.findByIdAndUpdate(
      subjectTypeExistance._id,
      { $push: { profs: newUser._id } },
      { new: true }
    );*/
    console.log(newUser);
    res.status(200).json({ newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add new User" });
  }
};

const login = async (req, res) => {
  const { Email, Password } = req.params;

  if (!(Email && Password)) {
    res.status(400).send("All fields are required");
    return; // Exit the function to avoid further processing
  }

  try {
    const user = await User.findOne({ email: Email }); // Access Email directly from req.body
    console.log(user);

    if (!user) {
      res.status(404).send("Unexistant user");
      return;
    }

    if (await bcrypt.compare(Password, user.password)) {
      const newToken = await jwt.sign({ id: user._id }, process.env.TOKENKEY, {
        expiresIn: "4d",
      });

      await user.updateOne({ _id: user._id }, { $set: { Token: newToken } });
      res.status(200).json({
        Token: newToken,
        FirstName: user.firstName,
        LastName: user.lastName,
        Email: user.email, // Use the correct field name
        ProfilePhoto: user.imageUrl,
      });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Server error" }); // Provide a generic error message to the user
  }
};

module.exports = {
  register,
  login,
};
