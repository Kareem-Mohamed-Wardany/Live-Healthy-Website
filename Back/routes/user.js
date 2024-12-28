const express = require("express");
const userController = require("../controllers/user");
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get("/:id", userController.getUser);
router.post("/update-balance", isAuth, userController.updateUserBalance);

module.exports = router;
