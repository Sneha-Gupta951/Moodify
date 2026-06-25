
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller")

const authUser = require('../middlewear/auth.middleware');

router.post('/register', authController.registerUser)

router.post('/login',authController.loginUser)

router.get('/get-me',authUser ,  authController.getUserDetails)

router.get("/logout", authController.logoutUser)
module.exports = router