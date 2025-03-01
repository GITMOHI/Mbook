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
  fetchAllFriendsById,
  confirmFriendRequest,
  deleteFriendRequest,
  fetchNewsFeed,

} = require("../controllers/userController");
const { authenticateUser } = require("../controllers/authController");
const router = express.Router();

// router
//   .get("/:userId/sentRequests", getSentRequests)
//   .get("/:userId/allFriendRequests", authenticateUser, getAllFriendRequest)
//   .get("/:userId/fetchAllFriends", authenticateUser, fetchAllFriendsById)
//   .get("/", authenticateUser, getUsers)
//   .get("/posts/:userId", fetchAllPosts)
//   .post("/confirmFriendRequest", authenticateUser, confirmFriendRequest(io))
//   .post("/sendFriendRequest", authenticateUser, sendFriendRequest)
//   .post("/:userId/setProfilePic", authenticateUser, setProfilePicture)
//   .post("/:userId/setCoverPic", authenticateUser, setCoverPicture)
//   .post("/:userId/postToProfile", authenticateUser, postToProfile)
//   .patch("/:userId/details", authenticateUser, updateUserDetails);

// module.exports = router;


// Export the function that accepts io
module.exports = (io) => {
  router
    .get("/:userId/sentRequests", getSentRequests)
    .get("/:userId/allFriendRequests", authenticateUser, getAllFriendRequest)
    .get("/:userId/fetchAllFriends", authenticateUser, fetchAllFriendsById)
    .get("/", authenticateUser, getUsers)
    .get("/posts/:userId", fetchAllPosts)
    .get("/newsFeed/:userId", fetchNewsFeed)
    .post("/confirmFriendRequest", authenticateUser, confirmFriendRequest(io))  // Pass io to confirmFriendRequest
    .post("/sendFriendRequest", authenticateUser, sendFriendRequest)
    .post("/:userId/setProfilePic", authenticateUser, setProfilePicture)
    .post("/:userId/setCoverPic", authenticateUser, setCoverPicture)
    .post("/:userId/postToProfile", authenticateUser, postToProfile)
    .patch("/:userId/details", authenticateUser, updateUserDetails)
    .delete("/deleteFriendRequest",authenticateUser, deleteFriendRequest)
  return router;
};