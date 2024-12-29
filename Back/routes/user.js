const express = require("express");
const userController = require("../controllers/user");
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get("/:id", userController.getUser);
router.post("/update-balance", isAuth, userController.updateUserBalance);
router.post("/update-vip", isAuth, userController.updateUserVip);

module.exports = router;
