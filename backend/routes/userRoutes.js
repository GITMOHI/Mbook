const express = require('express');
const { getUsers, updateUserDetails, setProfilePicture, postToProfile, fetchAllPosts, setCoverPicture } = require('../controllers/userController');
const { authenticateUser } = require('../controllers/authController');
const router = express.Router();

router.get('/', getUsers)
      .get('/posts/:userId',fetchAllPosts)
      .post('/:userId/setProfilePic',authenticateUser,setProfilePicture)
      .post('/:userId/setCoverPic',authenticateUser,setCoverPicture)
      .post('/:userId/postToProfile',authenticateUser,postToProfile)
      .patch("/:userId/details", authenticateUser, updateUserDetails)


module.exports = router;