const express = require('express');
const { getUsers, updateUserDetails, setProfilePicture } = require('../controllers/userController');
const { authenticateUser } = require('../controllers/authController');
const router = express.Router();

router.get('/', getUsers)
      .post('/:userId/setProfilePic',authenticateUser,setProfilePicture)
      router.patch("/:userId/details", authenticateUser, updateUserDetails)


module.exports = router;