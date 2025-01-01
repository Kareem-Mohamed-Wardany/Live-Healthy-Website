const express = require("express");
const radioController = require("../controllers/radiocenter");

const router = express.Router();

router.get("/centers", radioController.getAllRadiologyCenters);

module.exports = router;
