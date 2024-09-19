const { Router } = require("express");
const { handleUserRegister, handleUserLogin } = require("../controllers/user");
// const User = require("../models/User");

const router = Router();

router.post("/register", handleUserRegister);
router.post("/login", handleUserLogin);

module.exports = router
