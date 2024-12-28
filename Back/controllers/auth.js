const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const RadioCenter = require("../models/radiologyCenter");

exports.signup = async function (req, res, next) {
  const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error("Validation failed.");
  //   error.statusCode = 422;
  //   error.data = errors.array();
  //   throw error;
  // }IDBack
  const email = req.body.mail;
  const name = req.body.name;
  const phone = req.body.phone;
  const birth = req.body.birth;
  const gender = req.body.gender;
  const accountType = req.body.accountType;
  const password = req.body.password;
  const hashedPW = await bcrypt.hash(password, 12);

  let user;
  if (accountType === "patient") {
    const blood = req.body.bloodType;
    const smoker = req.body.smoker || false;
    const heartDiseases = req.body.heartDiseases || false;
    const diabetes = req.body.diabetes || false;
    const cancer = req.body.cancer || false;
    const obesity = req.body.obesity || false;
    const hypertension = req.body.hypertension || false;
    const allergies = req.body.allergies || false;
    user = new User({
      mail: email,
      password: hashedPW,
      name: name,
      accountType: accountType,
      phone: phone,
      dateOfBirth: birth,
      gender: gender,
      balance: 0,
      healthStatus: {
        bloodType: blood,
        smoker: smoker,
        HeartDiseases: heartDiseases,
        Diabetes: diabetes,
        Cancer: cancer,
        Obesity: obesity,
        Hypertension: hypertension,
        Allergies: allergies,
      },
    });
  }
  if (accountType === "specialist" || accountType === "consultant") {
    const university = req.body.university;
    const IDFront = req.body.IDFront;
    const IDBack = req.body.IDBack;
    const ProfFront = req.body.ProfFront;
    const ProfBack = req.body.ProfBack;
    user = new User({
      mail: email,
      password: hashedPW,
      name: name,
      accountType: accountType,
      phone: phone,
      dateOfBirth: birth,
      gender: gender,
      docData: {
        university: university,
        IDFront: IDFront,
        IDBack: IDBack,
        ProfFront: ProfFront,
        ProfBack: ProfBack,
        verified: false,
      },
    });

    if (accountType === "radiologist") {
      const centerName = req.body.centerName;
      const code = req.body.code;
      const center = await RadioCenter.findOne({ name: centerName });
      if (code !== center.code)
        res.status(404).json({ message: "Invalid Code" });
      user = new User({
        mail: email,
        password: hashedPW,
        name: name,
        accountType: accountType,
        phone: phone,
        dateOfBirth: birth,
        gender: gender,
        centerID: center._id,
      });
    }
  }
  const result = await user.save();
  if (result)
    res
      .status(201)
      .json({ message: "User created!", userId: result._id, user: result });
  else {
    const error = new Error("Failed to create user.");
    error.statusCode = 500;
    throw error;
  }
};

exports.login = async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const loadedUser = await User.findOne({ mail: email });
    if (!loadedUser) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, loadedUser.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        mail: loadedUser.mail,
        userId: loadedUser._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      userId: loadedUser._id.toString(),
      userType: loadedUser.accountType,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
