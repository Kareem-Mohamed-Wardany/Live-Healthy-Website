const express = require("express");
const appointmentController = require("../controllers/appointment");

const TypeAuth = require("../middleware/type-auth")

const router = express.Router();

router.post("/create", TypeAuth("patient"), appointmentController.createAppointment);
router.post("/accept/:id", TypeAuth("specialist", "consultant"), appointmentController.appointmentAccept)
router.post("/cancel/:id", TypeAuth("specialist", "consultant"), appointmentController.appointmentCancel)
router.post("/finish/:id", TypeAuth("specialist", "consultant"), appointmentController.appointmentFinish)
// router.post("/verify/:id", appointmentController.verifyDoctor)

router.get("/myappointment", TypeAuth("patient"), appointmentController.getMyAppointment);
router.get("/myappointments", TypeAuth("specialist", "consultant"), appointmentController.getMyAppointments);
router.get("/pending-appointment", TypeAuth("specialist", "consultant"), appointmentController.getPendingAppointments);
// router.get("/doctors", appointmentController.getAllDoctors);



// router.delete("/centers/:id", appointmentController.deleteCenter);
// router.delete("/doctors/:id", appointmentController.deleteDoctor);

module.exports = router;
