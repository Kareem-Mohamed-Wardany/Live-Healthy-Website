const express = require("express");
const { body } = require("express-validator");

const radioController = require("../controllers/radiocenter");

const router = express.Router();
router.post(
  "/add-center",
  [
    body("mail")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("name").trim().not().isEmpty(),
    body("address").trim().not().isEmpty(),
    body("phone").trim().not().isEmpty(),
  ],
  radioController.addRadiologyCenter
);

router.get("/centers", radioController.getAllRadiologyCenters);

module.exports = router;
