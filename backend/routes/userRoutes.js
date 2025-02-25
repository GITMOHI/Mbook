const express = require("express");
const {
  getUsers,
  updateUserDetails,
  setProfilePicture,
  postToProfile,
  fetchAllPosts,
  setCoverPicture,
  sendFriendRequest,
  getAllFriendRequest,
  getSentRequests,
} = require("../controllers/userController");
const { authenticateUser } = require("../controllers/authController");
const router = express.Router();

router
  .get("/:userId/sentRequests", getSentRequests)
  .get("/:userId/allFriendRequests", authenticateUser, getAllFriendRequest)
  .get("/", authenticateUser, getUsers)
  .get("/posts/:userId", fetchAllPosts)
  .post("/sendFriendRequest", authenticateUser, sendFriendRequest)
  .post("/:userId/setProfilePic", authenticateUser, setProfilePicture)
  .post("/:userId/setCoverPic", authenticateUser, setCoverPicture)
  .post("/:userId/postToProfile", authenticateUser, postToProfile)
  .patch("/:userId/details", authenticateUser, updateUserDetails);

// router.get('/', authenticateUser, getUsers);
// router.get('/allreq/friends', authenticateUser,getAllFriendRequest);
// router.get('/posts/:userId', fetchAllPosts);
// router.post('/sendFriendRequest', authenticateUser, sendFriendRequest);
// router.post('/:userId/setProfilePic', authenticateUser, setProfilePicture);
// router.post('/:userId/setCoverPic', authenticateUser, setCoverPicture);
// router.post('/:userId/postToProfile', authenticateUser, postToProfile);
// router.patch('/:userId/details', authenticateUser, updateUserDetails);

module.exports = router;
