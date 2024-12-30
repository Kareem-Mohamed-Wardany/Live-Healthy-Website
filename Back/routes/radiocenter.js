const express = require("express");
const radioController = require("../controllers/radiocenter");

const router = express.Router();
router.post("/add-center", radioController.addRadiologyCenter);

router.get("/centers", radioController.getAllRadiologyCenters);

module.exports = router;
