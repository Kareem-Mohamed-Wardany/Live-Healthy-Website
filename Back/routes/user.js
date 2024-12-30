const express = require("express");
const userController = require("../controllers/user");
const isAuth = require('../middleware/is-auth');
const TypeAuth = require('../middleware/type-auth');

const router = express.Router();

router.get("/:id", userController.getUser);
router.post("/update-balance", isAuth, TypeAuth('patient'), userController.updateUserBalance);
router.post("/update-vip", isAuth, TypeAuth('patient'), userController.updateUserVip);

module.exports = router;
