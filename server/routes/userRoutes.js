const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require('../auth');
const { verify } = auth;

// REGISTER
router.post("/register", userController.registerUser);

// LOGIN
router.post("/login", userController.loginUser);

router.get("/profile", verify, userController.getProfile);

module.exports = router;
