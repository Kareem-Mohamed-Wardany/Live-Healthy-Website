const express = require("express");
const multer = require("multer");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const exten = file.mimetype.split('/')[1]
    const username = req.body.mail.lowercase() || "unknown"; // Fallback if username is not provided
    const fieldName = `${username}-${file.fieldname}`; // Dynamic field name
    cb(null, fieldName + "." + exten);
  },
});

const upload = multer({ storage });

router.post(
  "/signup",
  upload.fields([
    { name: "IDFront", maxCount: 1 },
    { name: "IDBack", maxCount: 1 },
    { name: "ProfessionLicenseFront", maxCount: 1 },
    { name: "ProfessionLicenseBack", maxCount: 1 },
  ]), authController.register);

router.post("/login", authController.login);

module.exports = router;
