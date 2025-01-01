const express = require("express");
const adminController = require("../controllers/admin");


const router = express.Router();

router.post("/add-center", adminController.addRadiologyCenter);
router.post("/verify/:id", adminController.verifyDoctor)

router.get("/centers", adminController.getAllRadiologyCenters);
router.get("/doctors", adminController.getAllDoctors);



router.delete("/centers/:id", adminController.deleteCenter);
router.delete("/doctors/:id", adminController.deleteDoctor);

module.exports = router;
