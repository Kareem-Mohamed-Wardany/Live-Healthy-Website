const express = require("express");
const chatController = require("../controllers/chat");

const TypeAuth = require("../middleware/type-auth")

const router = express.Router();

router.post("/create", TypeAuth("patient"), chatController.createChatReq);
router.post("/accept/:id", TypeAuth("specialist", "consultant"), chatController.chatAccept)
// router.post("/finish/:id", TypeAuth("specialist", "consultant"), chatController.appointmentFinish)

router.get("/mychat", chatController.getChatReq);
router.get("/active-chat", TypeAuth("specialist", "consultant"), chatController.getMyChats);
router.get("/pending-chat", TypeAuth("specialist", "consultant"), chatController.getPendingChats);
router.get("/:id", TypeAuth("specialist", "consultant"), chatController.getChatData);



// router.delete("/centers/:id", chatController.deleteCenter);
// router.delete("/doctors/:id", chatController.deleteDoctor);

module.exports = router;
