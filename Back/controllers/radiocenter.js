const RadiologyCenter = require("../models/radiologyCenter");

exports.getAllRadiologyCenters = async (req, res, next) => {
  try {
    const radiologyCenters = await RadiologyCenter.find();
    console.log(radiologyCenters);
    res.status(200).json({ radiologyCenters });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const generateCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  let length = 16;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

exports.addRadiologyCenter = async (req, res, next) => {
  const code = generateCode();
  const radiologyCenter = new RadiologyCenter({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    mail: req.body.mail,
    code: code,
  });
  const result = await radiologyCenter.save();
  if (!result) {
    const error = new Error("Something went wrong while saving center");
    error.statusCode = 500;
    throw error;
  }
  res
    .status(201)
    .json({ message: "Radiology Center added successfully", code: code });
};
