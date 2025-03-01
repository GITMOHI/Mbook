const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { register, login, refreshToken, fetchMe, logout, confirmFriendRequest } = require("../controllers/authController");

const router = express.Router();


router.post('/register',register)
      .post('/login',login)
      .post('/refresh',refreshToken)
      .post('/logout',logout)
      .get('/me',fetchMe)


module.exports = router;